import { useRef, useState } from "react"
import { useDependencies } from "@ratatouille/modules/app/react/DependenciesProvider"
import { GuestForm } from "@ratatouille/modules/order/core/form/guest.form"
import { OrderingDomainModel } from "@ratatouille/modules/order/core/model/ordering.domain-model"

export const useGuestSection = () => {
  const addGuest = () => {
    const newState = guestForm.current.addGuest(guests)
    setGuests(newState)
  }

  const removeGuest = (id: string) => {
    setGuests((guests) => guests.filter((guest) => guest.id !== id))
  }

  const updateGuest = (id: string, key: string, value: any) => {}

  const changeOrganizer = () => {}

  const onNext = () => {}

  const isSubmittable = () => {
    return false
  }

  const { idProvider } = useDependencies()
  const guestForm = useRef(new GuestForm(idProvider))
  const [guests, setGuests] = useState<OrderingDomainModel.Guest[]>([])

  return {
    addGuest,
    removeGuest,
    updateGuest,
    changeOrganizer,
    onNext,
    isSubmittable,
    guests,
  }
}
