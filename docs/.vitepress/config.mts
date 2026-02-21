import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "HieroKit",
  description: "A developer experience toolkit for Hiero/Hedera",
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    siteTitle: false,
    logo: {
      light: '/logo_black.png',
      dark: '/logo_white.png'
    },
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Hooks', link: '/hooks/index' },
      { text: 'API', link: '/api/client' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Mental Model', link: '/guide/mental-model' },
          { text: 'SDK vs HieroKit', link: '/guide/sdk-vs-hierokit' },
          { text: 'React overview', link: '/guide/react' },
          { text: 'Client abstraction', link: '/guide/client-abstraction' },
          { text: 'Transaction flows', link: '/guide/transaction-flows' },
          { text: 'Idempotency', link: '/guide/idempotency' }
        ]
      },
      {
        text: 'Hooks',
        items: [
          { text: 'Overview', link: '/hooks/index' },

          { text: 'useHieroClient', link: '/hooks/useHieroClient' },
          { text: 'useHieroConfig', link: '/hooks/useHieroConfig' },
          { text: 'useNetwork', link: '/hooks/useNetwork' },
          { text: 'useLedgerId', link: '/hooks/useLedgerId' },
          { text: 'useNodeList', link: '/hooks/useNodeList' },
          { text: 'useNetworkAddressBook', link: '/hooks/useNetworkAddressBook' },
          { text: 'useClientStatus', link: '/hooks/useClientStatus' },
          { text: 'useClientHealth', link: '/hooks/useClientHealth' },
          { text: 'useMirrorNodeUrl', link: '/hooks/useMirrorNodeUrl' },
          { text: 'useMirrorRest', link: '/hooks/useMirrorRest' },
          { text: 'useMaxTransactionFee', link: '/hooks/useMaxTransactionFee' },
          { text: 'useDefaultOperator', link: '/hooks/useDefaultOperator' },

          { text: 'useAccountId', link: '/hooks/useAccountId' },
          { text: 'useAccountInfo', link: '/hooks/useAccountInfo' },
          { text: 'useAccountBalance', link: '/hooks/useAccountBalance' },
          { text: 'useAccountHbarBalance', link: '/hooks/useAccountHbarBalance' },
          { text: 'useAccountTokens', link: '/hooks/useAccountTokens' },
          { text: 'useAccountNFTs', link: '/hooks/useAccountNFTs' },
          { text: 'useAccountKeys', link: '/hooks/useAccountKeys' },
          { text: 'useAccountStakingInfo', link: '/hooks/useAccountStakingInfo' },
          { text: 'useUpdateAccountStaking', link: '/hooks/useUpdateAccountStaking' },
          { text: 'useAccountMemo', link: '/hooks/useAccountMemo' },
          { text: 'useIsAccountDeleted', link: '/hooks/useIsAccountDeleted' },
          { text: 'useIsAccountFrozen', link: '/hooks/useIsAccountFrozen' },
          { text: 'useAccountExpiration', link: '/hooks/useAccountExpiration' },
          { text: 'useAccountAutoRenew', link: '/hooks/useAccountAutoRenew' },
          { text: 'useAccountProxy', link: '/hooks/useAccountProxy' },
          { text: 'useAccountLedgerId', link: '/hooks/useAccountLedgerId' },

          { text: 'useTransferHbar', link: '/hooks/useTransferHbar' },
          { text: 'useTransferToken', link: '/hooks/useTransferToken' },
          { text: 'useBatchTransfer', link: '/hooks/useBatchTransfer' },
          { text: 'useMultiTokenTransfer', link: '/hooks/useMultiTokenTransfer' },
          { text: 'useScheduledTransfer', link: '/hooks/useScheduledTransfer' },
          { text: 'useApproveAllowance', link: '/hooks/useApproveAllowance' },
          { text: 'useRevokeAllowance', link: '/hooks/useRevokeAllowance' },
          { text: 'useAllowanceStatus', link: '/hooks/useAllowanceStatus' },
          { text: 'useEstimateTransferFee', link: '/hooks/useEstimateTransferFee' },
          { text: 'useTransferPreview', link: '/hooks/useTransferPreview' },
          { text: 'useTransferFlowStatus', link: '/hooks/useTransferFlowStatus' },
          { text: 'useTransferHistory', link: '/hooks/useTransferHistory' },

          { text: 'useTokenInfo', link: '/hooks/useTokenInfo' },
          { text: 'useTokenSupply', link: '/hooks/useTokenSupply' },
          { text: 'useTokenMetadata', link: '/hooks/useTokenMetadata' },
          { text: 'useTokenNfts', link: '/hooks/useTokenNfts' },
          { text: 'useNftInfo', link: '/hooks/useNftInfo' },
          { text: 'useCreateFungibleToken', link: '/hooks/useCreateFungibleToken' },
          { text: 'useUpdateToken', link: '/hooks/useUpdateToken' },
          { text: 'useMintFungibleToken', link: '/hooks/useMintFungibleToken' },
          { text: 'useBurnFungibleToken', link: '/hooks/useBurnFungibleToken' },
          { text: 'useMintNft', link: '/hooks/useMintNft' },
          { text: 'useBurnNft', link: '/hooks/useBurnNft' },
          { text: 'useAssociateToken', link: '/hooks/useAssociateToken' },
          { text: 'useDissociateToken', link: '/hooks/useDissociateToken' },
          { text: 'useGrantTokenKyc', link: '/hooks/useGrantTokenKyc' },
          { text: 'useRevokeTokenKyc', link: '/hooks/useRevokeTokenKyc' },
          { text: 'useFreezeTokenAccount', link: '/hooks/useFreezeTokenAccount' },
          { text: 'useUnfreezeTokenAccount', link: '/hooks/useUnfreezeTokenAccount' },
          { text: 'usePauseToken', link: '/hooks/usePauseToken' },
          { text: 'useUnpauseToken', link: '/hooks/useUnpauseToken' },

          { text: 'useTransactionFlow', link: '/hooks/useTransactionFlow' },
          { text: 'useCreateFlow', link: '/hooks/useCreateFlow' },
          { text: 'useFlowStatus', link: '/hooks/useFlowStatus' },
          { text: 'useFlowReceipt', link: '/hooks/useFlowReceipt' },
          { text: 'useFlowError', link: '/hooks/useFlowError' },
          { text: 'useRetryFlow', link: '/hooks/useRetryFlow' },
          { text: 'useCancelFlow', link: '/hooks/useCancelFlow' },
          { text: 'useFlowTimeout', link: '/hooks/useFlowTimeout' },
          { text: 'usePollingQuery', link: '/hooks/usePollingQuery' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Client', link: '/api/client' },
          { text: 'Transactions', link: '/api/transactions' },
          { text: 'Errors', link: '/api/errors' },
          { text: 'Results', link: '/api/results' },
          { text: 'Signer', link: '/api/signer' },
          { text: 'Intent', link: '/api/intent' },
          { text: 'Fees', link: '/api/fees' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/youvandra/hierokit' }
    ]
  }
})
