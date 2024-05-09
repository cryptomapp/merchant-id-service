/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { CnftIdentifier, cnftIdentifierBeet } from '../types/CnftIdentifier'

/**
 * @category Instructions
 * @category InitializeMerchant
 * @category generated
 */
export type InitializeMerchantInstructionArgs = {
  nftIdentifier: CnftIdentifier
}
/**
 * @category Instructions
 * @category InitializeMerchant
 * @category generated
 */
export const initializeMerchantStruct = new beet.BeetArgsStruct<
  InitializeMerchantInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['nftIdentifier', cnftIdentifierBeet],
  ],
  'InitializeMerchantInstructionArgs'
)
/**
 * Accounts required by the _initializeMerchant_ instruction
 *
 * @property [_writable_] merchantAccount
 * @property [_writable_] userAccount
 * @property [] userPubkey
 * @property [_writable_, **signer**] serviceWallet
 * @property [_writable_] state
 * @category Instructions
 * @category InitializeMerchant
 * @category generated
 */
export type InitializeMerchantInstructionAccounts = {
  merchantAccount: web3.PublicKey
  userAccount: web3.PublicKey
  userPubkey: web3.PublicKey
  serviceWallet: web3.PublicKey
  state: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const initializeMerchantInstructionDiscriminator = [
  7, 90, 74, 38, 99, 111, 142, 77,
]

/**
 * Creates a _InitializeMerchant_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitializeMerchant
 * @category generated
 */
export function createInitializeMerchantInstruction(
  accounts: InitializeMerchantInstructionAccounts,
  args: InitializeMerchantInstructionArgs,
  programId = new web3.PublicKey('6gVqqXEwoTX7AZTBYQDEaXntMiBPnTAyBbuMCeqk5avi')
) {
  const [data] = initializeMerchantStruct.serialize({
    instructionDiscriminator: initializeMerchantInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.merchantAccount,
      isWritable: true,
      isSigner: false,
    },
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
      isWritable: true,
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
