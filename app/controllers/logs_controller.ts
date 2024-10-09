import ElasticService from '#services/elastic_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'

@inject()
export default class PostsController {
  constructor(protected elastic: ElasticService) {}

  async index({ request }: HttpContext) {
    let { page = 1, perPage = 20, sort, search } = request.qs()
    let from = (page - 1) * perPage
    let query: any = {
      index: 'log-system',
      from: from,
      size: perPage,
      track_total_hits: true,
      query: {
        bool: {
          must: [],
        },
      },
    }

    if (sort) {
      let sort_dir: 'asc' | 'desc' = sort.startsWith('-') ? 'desc' : 'asc'
      let sort_value = sort.replace('-', '')
      query.sort = [{ [sort_value] : { order: sort_dir } }]
    } else {
      query.sort = [{ id : { order: 'desc' } }]
    }
    if (search) {
      let match = {
        multi_match: {
          query: search,
          fields: ['title', 'content', 'author'],
          type: 'best_fields',
        },
      };
      query.query.bool.must.push(match);
    }

    const res = await this.elastic.client.search(query)
    let items: any = {}
    items.data = res.hits.hits.map((x) => x._source)
    let total = (res.hits.total as any).value
    items.meta = {
      total,
      perPage,
      currentPage: +page,
      lastPage: Math.ceil(total / perPage),
    }
    return items
  }
}
