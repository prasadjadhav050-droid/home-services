import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectProfessionals } from '../features/professionals/professionalSlice'
import { selectAgencies } from '../features/agencies/agencySlice'
import { selectServices, selectServiceById } from '../features/services/serviceSlice'

export const useCatalog = () => {
  const professionals = useSelector(selectProfessionals)
  const agencies = useSelector(selectAgencies)
  const services = useSelector(selectServices)

  return useMemo(() => {
    const proMap = Object.fromEntries(professionals.map((p) => [p.id, p]))
    const agencyMap = Object.fromEntries(agencies.map((a) => [a.id, a]))
    const svcMap = Object.fromEntries(services.map((s) => [s.id, s]))
    return {
      professionals, agencies, services,
      proMap, agencyMap, svcMap,
      proName: (id) => proMap[id]?.name || '—',
      agencyName: (id) => agencyMap[id]?.name || '—',
      serviceById: (id) => svcMap[id],
      providerNameForBooking: (b) =>
        b.providerType === 'agency'
          ? (agencyMap[b.agencyId]?.name || agencyMap[b.providerId]?.name || '—')
          : (proMap[b.professionalId]?.name || proMap[b.providerId]?.name || '—'),
    }
  }, [professionals, agencies, services])
}

export default useCatalog