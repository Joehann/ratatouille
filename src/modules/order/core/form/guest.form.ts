import { IIDProvider } from "@ratatouille/modules/core/id-provider"
import { OrderingDomainModel } from "@ratatouille/modules/order/core/model/ordering.domain-model"

export class GuestForm {
  constructor(private idProvider: IIDProvider) {}
  public addGuest(state: OrderingDomainModel.Guest[]) {
    return [
      ...state,
      {
        id: this.idProvider.generate(),
        firstName: "John",
        lastName: "Doe",
        age: 0,
      },
    ]
  }
}
