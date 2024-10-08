import { BaseModel } from "@adonisjs/lucid/orm";
import {
    LucidModel,
    LucidRow,
    ModelQueryBuilderContract
} from "@adonisjs/lucid/types/model";

export default class MyModel extends BaseModel {

    static get preloads(): any[] {
        return [];
    }

    static get softDelete() {
        return true;
    }

    static apply_preloads(query: any) {
        query = query || super.query();
        for (let preload of this.preloads) {
            if (preload instanceof Array) {
                query = query.preload(preload[0], preload[1]);
            } else {
                query = query.preload(preload as any);
            }
        }

        return query;
    }


    static firstOrFailWithPreloads(id: any) {
        let query = super.query().where("id", id);
        query = this.apply_preloads(query);
        return query.firstOrFail();
    }

    static async listOptions(params: any, user_id: number) {
        let query = super.query();
        let filtersArray = (params.filters && JSON.parse(params.filters)) || [];

        if (this.softDelete !== false) {
            if (!JSON.stringify(filtersArray).includes("is_deleted")) {
                filtersArray.push("is_deleted:0:=");
            }
        }

        const page = parseInt(params.page || "1");
        const perPage = parseInt(params.perPage || "10");
        query = query.where({ user_id })
        query = this.apply_filters(query, filtersArray);

        for (let preload of this.preloads) {
            if (preload instanceof Array) {
                query = query.preload(preload[0], preload[1]);
            } else {
                query = query.preload(preload as any);
            }
        }

        const result = await query.paginate(page, perPage);

        const { data, meta } = JSON.parse(JSON.stringify(result));

        return {
            data,
            total: meta.total,
            page,
            perPage,
            lastPage: meta.last_page,
        };
    }

    private static apply_filters(
        query: ModelQueryBuilderContract<LucidModel, LucidRow>,
        filters: string[]
    ) {
        for (let filter of filters) {
            let [property, value, opt] = filter.split(":");
            if (opt === "equal") opt = "=";

            if (opt === "like" && !value.includes(",")) value = `%${value}%`;

            if (property.includes(".")) {
                const [a, b]: any = property.split(".");

                query = query.whereHas(a, (builder) => {
                    if (value.includes(",")) {
                        if (opt === "between") {
                            const [start, end] = value.split(",");
                            builder.whereBetween(b, [start, end]);
                        } else {
                            builder.whereIn(b, value.split(","));
                        }
                    } else {
                        builder.where(b, opt || "=", value);
                    }
                });
            } else {
                if (value.includes(",")) {
                    if (opt === "between") {
                        const [start, end] = value.split(",");
                        query = query.whereBetween(property, [start, end]);
                    } else {
                        query = query.whereIn(property, value.split(","));
                    }
                } else {
                    query = query.where(property, opt || "=", value);
                }
            }
        }

        return query;
    }
}
