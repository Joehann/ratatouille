import { produce } from "immer"
import { IIDProvider } from "@ratatouille/modules/core/id-provider"
import { OrderingDomainModel } from "@ratatouille/modules/order/core/model/ordering.domain-model"

export class GuestForm {
  constructor(private idProvider: IIDProvider) {}
  public addGuest(state: OrderingDomainModel.Form) {
    return produce(state, (draft) => {
      draft.guests.push({
        id: this.idProvider.generate(),
        firstName: "John",
        lastName: "Doe",
        age: 0,
      })
    })
  }

  public removeGuest(state: OrderingDomainModel.Form, id: string) {
    return {
      ...state,
      guests: state.guests.filter((guest) => guest.id !== id),
      organizerId: state.organizerId === id ? null : state.organizerId,
    }
  }

  public changeOrganizer(state: OrderingDomainModel.Form, id: string) {
    return {
      ...state,
      organizerId: state.guests.some((guest) => guest.id === id) ? id : null,
    }
  }

  public isSubmittable(state: OrderingDomainModel.Form) {
    return (
      state.organizerId !== null &&
      state.guests.every(
        (guest) =>
          guest.age > 0 &&
          guest.firstName.length > 0 &&
          guest.lastName.length > 0
      )
    )
  }

  public updateGuest<T extends keyof OrderingDomainModel.Guest>(
    state: OrderingDomainModel.Form,
    id: string,
    key: T,
    value: OrderingDomainModel.Guest[T]
  ) {
    return produce(state, (draft) => {
      const guest = draft.guests.find((guest) => guest.id === id)
      if (!guest) return
      else guest[key] = value
    })
  }
}
