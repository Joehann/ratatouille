import { IIDProvider } from "@ratatouille/modules/core/id-provider"
import { nanoid } from "nanoid"

export class SystemIdProvider implements IIDProvider {
  generate(): string {
    return nanoid()
  }
}
