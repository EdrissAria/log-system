import ElasticService from '#services/elastic_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'

@inject()
export default class LogsController {
  constructor(protected elastic: ElasticService) {}

  async index({ request }: HttpContext) {
    let { page = 1, perPage = 20, sort, filters } = request.qs()
    let from = (page - 1) * perPage
    let query: any = {
      index: 'logs',
      from: from,
      size: perPage,
      track_total_hits: true,
      query: {
        bool: {
          must: [],
          filter: [], 
        },
      },
    }

    if (sort) {
      let sort_dir: 'asc' | 'desc' = sort.startsWith('-') ? 'desc' : 'asc'
      let sort_value = sort.replace('-', '')
      query.sort = [{ [sort_value]: { order: sort_dir } }]
    } else {
      query.sort = [{ project_id: { order: 'desc' } }]
    }

    if (filters) {
      let parsedFilters = (filters && JSON.parse(filters)) || []
      for (let filter of parsedFilters) {
        let [property, value, opt] = filter.split(':')
        if (opt === 'equal') opt = '='

        if (value.includes(',')) {
          if (opt === 'between') {
            const [start, end] = value.split(',')
            query.query.bool.filter.push({
              range: {
                [property]: {
                  gte: start,
                  lte: end,
                },
              },
            })
          } else {
            query.query.bool.filter.push({
              terms: { [property]: value.split(',') },
            })
          }
        } else {
          query.query.bool.filter.push({
            term: { [property]: value },
          })
        }
      }
    }

    const res = await this.elastic.client.search(query)

    // Formatting the results
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
