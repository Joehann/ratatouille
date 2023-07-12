import { IIDProvider } from "@ratatouille/modules/core/id-provider"
import { GuestForm } from "@ratatouille/modules/order/core/form/guest.form"
import { GuestFactory } from "@ratatouille/modules/order/core/model/guest.factory"
import { OrderingDomainModel } from "@ratatouille/modules/order/core/model/ordering.domain-model"

class StubIDProvider implements IIDProvider {
  generate(): string {
    return "1"
  }
}

const idProvider = new StubIDProvider()

const emptyInitialState: OrderingDomainModel.Form = {
  guests: [],
  organizerId: null,
}

const johndoe = GuestFactory.create({
  id: "1",
  firstName: "John",
  lastName: "Doe",
  age: 24,
})
const janedoe = GuestFactory.create({
  id: "2",
  firstName: "Jane",
  lastName: "Doe",
  age: 24,
})

const stateWithOneUser: OrderingDomainModel.Form = {
  guests: [johndoe],
  organizerId: null,
}
const stateWithTwoUsers: OrderingDomainModel.Form = {
  guests: [johndoe, janedoe],
  organizerId: null,
}
const form = new GuestForm(idProvider)

describe("Add a guest", () => {
  it("should have a guest", () => {
    const state = form.addGuest(emptyInitialState)
    expect(state.guests).toEqual([
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        age: 0,
      },
    ])
  })
  it("should have a guest when there's already two", () => {
    const state = form.addGuest(stateWithTwoUsers)
    expect(state.guests).toEqual([
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        age: 24,
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Doe",
        age: 24,
      },
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        age: 0,
      },
    ])
  })
  it("should have a guest when there's already one", () => {
    const state = form.addGuest(stateWithOneUser)
    expect(state.guests).toEqual([
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        age: 24,
      },
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        age: 0,
      },
    ])
  })
})

describe("Removing a guest", () => {
  it("should do nothing when there is no user", () => {
    const state = form.removeGuest(emptyInitialState, "1")
    expect(state.guests).toEqual([])
  })

  it("should remove the user with ID 1 when there is an user with the ID 1", () => {
    const state = form.removeGuest(stateWithOneUser, "1")
    expect(state.guests).toEqual([])
  })

  it("should remove the user with ID 1 when there is an user with the ID 1, when there's two users", () => {
    const state = form.removeGuest(stateWithTwoUsers, "1")
    expect(state.guests).toEqual([
      {
        id: "2",
        firstName: "Jane",
        lastName: "Doe",
        age: 24,
      },
    ])
  })

  it("If I remove an organizer, it shoould set the organizer ID to null", () => {
    const stateWithOrganizer = { ...stateWithOneUser, organizerId: "1" }
    const state = form.removeGuest(stateWithOrganizer, "1")
    expect(state.organizerId).toEqual(null)
  })
})

describe("Add an organizer", () => {
  it("set organizer ID when the users does not exist", () => {
    const state = form.changeOrganizer(emptyInitialState, "1")
    expect(state.organizerId).toEqual(null)
  })

  it("set organizer ID when a user exists", () => {
    const state = form.changeOrganizer(stateWithOneUser, "1")
    expect(state.organizerId).toEqual("1")
  })
})

describe("Is submittable", () => {
  it("if no guest is an organizer, it should not be submitable", () => {
    const isSubmittable = form.isSubmittable(emptyInitialState)
    expect(isSubmittable).toEqual(false)
  })
  it("when one is an organizer, it should be submitable", () => {
    const withOrganizerState = {
      ...stateWithOneUser,
      organizerId: "1",
    }
    const isSubmittable = form.isSubmittable(withOrganizerState)
    expect(isSubmittable).toEqual(true)
  })

  it.each([{ age: 0 }, { firstName: "" }, { lastName: "" }])(
    "when the guest is not valid, it shoudl NOT be submittable",
    (guest) => {
      const withOrganizerState = {
        ...stateWithOneUser,
        organizerId: "1",
        guests: [{ ...johndoe, ...guest }],
      }
      const isSubmittable = form.isSubmittable(withOrganizerState)
      expect(isSubmittable).toEqual(false)
    }
  )
})

describe("Update guest", () => {
  it.each([
    {
      key: "firstName" as keyof OrderingDomainModel.Guest,
      value: "Jane",
    },
    {
      key: "lastName" as keyof OrderingDomainModel.Guest,
      value: "Wick",
    },
    {
      key: "age" as keyof OrderingDomainModel.Guest,
      value: 42,
    },
  ])(`should change the %s of the guest`, ({ key, value }) => {
    const state = form.updateGuest(stateWithOneUser, "1", key, value)
    expect(state.guests[0][key]).toEqual(value)
  })

  it("should do nothing if the id is not assigned", () => {
    const state = form.updateGuest(stateWithOneUser, "2", "firstName", "Jane")
    expect(state.guests).toEqual(stateWithOneUser.guests)
  })
})
