import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronLeft, WalletCards, X } from "lucide-react";
import "./wallet.css";

type WalletId = "metamask" | "rabby" | "walletconnect";

type WalletChoice = {
  id: WalletId;
  name: string;
  detail: string;
};

type WalletContextValue = {
  selectedWallet: WalletChoice | null;
  setSelectedWallet: (wallet: WalletChoice | null) => void;
};

type WalletButtonProps = {
  compact?: boolean;
};

const wallets: WalletChoice[] = [
  { id: "metamask", name: "MetaMask", detail: "Browser wallet" },
  { id: "rabby", name: "Rabby", detail: "Browser wallet" },
  { id: "walletconnect", name: "WalletConnect", detail: "Mobile or desktop" },
];

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [selectedWallet, setSelectedWallet] = useState<WalletChoice | null>(null);
  const value = useMemo(
    () => ({ selectedWallet, setSelectedWallet }),
    [selectedWallet],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

function useWalletSelection() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("WalletButton must be used within WalletProvider.");
  return context;
}

function ProviderIcon({ provider }: { provider: WalletId }) {
  if (provider === "metamask") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="m6 7 7 5-2 5 5 3 5-3-2-5 7-5-2 17-8 3-8-3L6 7Z" fill="currentColor" opacity=".16" />
        <path d="m6 7 7 5 3-7 3 7 7-5-2 17-8 3-8-3L6 7Zm5 10 5 3 5-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (provider === "rabby") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M10 13c-1-6 1-9 3-9 2 0 2 5 2 8m2 0c0-3 1-8 3-8 2 0 4 4 2 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 18c0-4 4-7 9-7s9 3 9 7-4 8-9 8-9-4-9-8Z" fill="currentColor" opacity=".14" />
        <path d="M7 18c0-4 4-7 9-7s9 3 9 7-4 8-9 8-9-4-9-8Zm6-1h.01M19 17h.01" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M7 12c5-5 13-5 18 0m-15 3c3-3 9-3 12 0m-9 3c2-2 4-2 6 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m8 16 8 8 8-8" fill="currentColor" opacity=".13" />
      <path d="m8 16 8 8 8-8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function WalletButton({ compact = false }: WalletButtonProps) {
  const { selectedWallet, setSelectedWallet } = useWalletSelection();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choose" | "confirm" | "manage">("choose");
  const [pendingWallet, setPendingWallet] = useState<WalletChoice | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const choiceListRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const focusCurrentStep = () => {
      if (!dialogRef.current?.open) return;
      if (step === "choose") {
        choiceListRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      } else if (step === "confirm") {
        confirmButtonRef.current?.focus();
      } else {
        changeButtonRef.current?.focus();
      }
    };

    if (dialogRef.current?.open) {
      focusCurrentStep();
      return;
    }

    const frame = window.requestAnimationFrame(focusCurrentStep);
    return () => window.cancelAnimationFrame(frame);
  }, [open, step]);

  const closeDialog = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const openDialog = () => {
    setPendingWallet(null);
    setStep(selectedWallet ? "manage" : "choose");
    setOpen(true);
  };

  const chooseWallet = (wallet: WalletChoice) => {
    setPendingWallet(wallet);
    setStep("confirm");
  };

  const confirmWallet = () => {
    if (!pendingWallet) return;
    setSelectedWallet(pendingWallet);
    closeDialog();
  };

  const disconnectWallet = () => {
    setSelectedWallet(null);
    setPendingWallet(null);
    closeDialog();
  };

  return (
    <>
      <button
        ref={triggerRef}
        className={`wallet-button ${compact ? "is-compact" : ""}`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openDialog}
      >
        <WalletCards size={compact ? 15 : 16} aria-hidden="true" />
        <span className="wallet-button-text">{selectedWallet?.name ?? "Connect wallet"}</span>
        <ChevronDown className="wallet-button-chevron" size={14} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        className="wallet-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="wallet-dialog-card">
          <div className="wallet-dialog-topline">
            {step === "confirm" ? (
              <button
                className="wallet-dialog-icon-button"
                type="button"
                aria-label="Back to wallet choices"
                onClick={() => {
                  setPendingWallet(null);
                  setStep("choose");
                }}
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
            ) : <span />}
            <button className="wallet-dialog-icon-button" type="button" aria-label="Close wallet selection" onClick={closeDialog}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="wallet-dialog-copy" key={step}>
            {step === "choose" && (
              <>
                <span className="wallet-dialog-eyebrow">Wallet preference</span>
                <h2 id={titleId}>Choose a wallet</h2>
                <p>Select the wallet you would like VEIL to remember for this session.</p>
                <div ref={choiceListRef} className="wallet-choice-list">
                  {wallets.map((wallet) => (
                    <button key={wallet.id} type="button" onClick={() => chooseWallet(wallet)}>
                      <span className={`wallet-provider-icon is-${wallet.id}`}><ProviderIcon provider={wallet.id} /></span>
                      <span><strong>{wallet.name}</strong><small>{wallet.detail}</small></span>
                      <ChevronDown size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "confirm" && pendingWallet && (
              <>
                <span className="wallet-dialog-eyebrow">Your selection</span>
                <h2 id={titleId}>Use this wallet?</h2>
                <p>VEIL will keep this choice in memory while this page is open.</p>
                <div className="wallet-confirm-card">
                  <span className={`wallet-provider-icon is-${pendingWallet.id}`}><ProviderIcon provider={pendingWallet.id} /></span>
                  <span><strong>{pendingWallet.name}</strong><small>{pendingWallet.detail}</small></span>
                </div>
                <button ref={confirmButtonRef} className="wallet-primary-action" type="button" onClick={confirmWallet}>Use this wallet</button>
              </>
            )}

            {step === "manage" && selectedWallet && (
              <>
                <span className="wallet-dialog-eyebrow">Wallet preference</span>
                <h2 id={titleId}>Selected wallet</h2>
                <p>This wallet is selected for your current VEIL session.</p>
                <div className="wallet-confirm-card">
                  <span className={`wallet-provider-icon is-${selectedWallet.id}`}><ProviderIcon provider={selectedWallet.id} /></span>
                  <span><strong>{selectedWallet.name}</strong><small>{selectedWallet.detail}</small></span>
                </div>
                <div className="wallet-manage-actions">
                  <button ref={changeButtonRef} type="button" onClick={() => setStep("choose")}>Change</button>
                  <button type="button" onClick={disconnectWallet}>Disconnect</button>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
