import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function WalletModal() {
  const wallets = [
    {
      name: "MetaMask",
      icon: "🦊",
      recommended: true,
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      recommended: false,
    },
    {
      name: "Coinbase Wallet",
      icon: "💼",
      recommended: false,
    },
  ];

  return (
    <DialogContent className="bg-[#161B22] border-purple-800/50 max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">
          Connect your Wallet
        </DialogTitle>
      </DialogHeader>

      {/* Wallet List */}
      <div className="flex flex-col gap-3 py-4">
        {wallets.map((wallet) => (
          <button
            key={wallet.name}
            className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-600/50 hover:bg-gray-800/70 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl">
                {wallet.icon}
              </div>
              <span className="text-white font-semibold text-lg">
                {wallet.name}
              </span>
            </div>
            {wallet.recommended && (
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/50">
                RECOMMENDED
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-4 space-y-3">
        <p className="text-center text-sm text-gray-400">
          ¿Eres nuevo en Web3?{" "}
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Aprende más sobre las wallets
          </a>
        </p>
        <p className="text-center text-xs text-gray-500">
          Al conectar una wallet, aceptas los Términos de Servicio de OctoFi.
        </p>
      </div>
    </DialogContent>
  );
}
