import { Client } from '@elastic/elasticsearch'
import env from '#start/env'
const client = new Client({
  node: env.get('ELASTIC_ENDPOINT'),
  auth: {
    username: env.get('ELASTIC_USERNAME')!,
    password: env.get('ELASTIC_PASSWORD')!,
  },
})
export default class ElasticService {
  client = client
}
