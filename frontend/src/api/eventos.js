import http from './http'

/** Eventos entre duas datas (YYYY-MM-DD), inclusive. */
export const listarEventos = (startDate, endDate) =>
  http
    .get('/api/eventos', { params: { start_date: startDate, end_date: endDate } })
    .then((r) => r.data)

export const criarEvento = (evento) => http.post('/api/eventos', evento).then((r) => r.data)
export const atualizarEvento = (id, evento) => http.put(`/api/eventos/${id}`, evento).then((r) => r.data)
export const removerEvento = (id) => http.delete(`/api/eventos/${id}`)
