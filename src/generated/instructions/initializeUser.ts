/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category InitializeUser
 * @category generated
 */
export const initializeUserStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'InitializeUserInstructionArgs'
)
/**
 * Accounts required by the _initializeUser_ instruction
 *
 * @property [_writable_] userAccount
 * @property [] userPubkey
 * @property [_writable_, **signer**] serviceWallet
 * @property [] state
 * @category Instructions
 * @category InitializeUser
 * @category generated
 */
export type InitializeUserInstructionAccounts = {
  userAccount: web3.PublicKey
  userPubkey: web3.PublicKey
  serviceWallet: web3.PublicKey
  state: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const initializeUserInstructionDiscriminator = [
  111, 17, 185, 250, 60, 122, 38, 254,
]

/**
 * Creates a _InitializeUser_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitializeUser
 * @category generated
 */
export function createInitializeUserInstruction(
  accounts: InitializeUserInstructionAccounts,
  programId = new web3.PublicKey('6gVqqXEwoTX7AZTBYQDEaXntMiBPnTAyBbuMCeqk5avi')
) {
  const [data] = initializeUserStruct.serialize({
    instructionDiscriminator: initializeUserInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.userAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userPubkey,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.serviceWallet,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.state,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
