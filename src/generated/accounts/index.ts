export * from './Merchant'
export * from './ProgramState'
export * from './User'

import { Merchant } from './Merchant'
import { User } from './User'
import { ProgramState } from './ProgramState'

export const accountProviders = { Merchant, User, ProgramState }
