import { useState } from "react";

export interface PaymentDetails {
  expertName: string;
  expertCompany: string;
  serviceName: string;
  durationMinutes: number;
  date: string;
  time: string;
  amountINR: number;
}

export interface PaymentSuccessResult {
  txnId: string;
  method: string;
  amount: number;
  timestamp: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: PaymentDetails;
  onSuccess: (result: PaymentSuccessResult) => void;
}

export function PaymentModal({ isOpen, onClose, details, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [upiProvider, setUpiProvider] = useState<"gpay" | "phonepe" | "paytm" | "custom">("gpay");
  const [customUpiId, setCustomUpiId] = useState("student@oksbi");
  const [cardNumber, setCardNumber] = useState("4532 8920 1142 8842");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvv, setCardCvv] = useState("412");

  // Simulation mode: user can toggle to test successful vs failed payment
  const [simulateOutcome, setSimulateOutcome] = useState<"success" | "failure">("success");
  const [isProcessing, setIsProcessing] = useState(false);
  const [failureError, setFailureError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setFailureError(null);

    // Simulate 1.1s gateway roundtrip
    setTimeout(() => {
      setIsProcessing(false);

      if (simulateOutcome === "failure") {
        setFailureError(
          "Payment Declined: Your simulated bank declined this demo transaction (Code: DEMO_INSUFFICIENT_FUNDS). Please retry or select another simulated payment option."
        );
        return;
      }

      // Success
      const txnId = `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      const methodLabel =
        paymentMethod === "upi"
          ? `UPI (${upiProvider.toUpperCase()})`
          : `Demo Card (•••• ${cardNumber.slice(-4)})`;

      onSuccess({
        txnId,
        method: methodLabel,
        amount: details.amountINR,
        timestamp: new Date().toISOString(),
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-150 animate-in fade-in duration-200 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-150">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF7F0] text-[#FF7A00] text-[11px] font-bold mb-1 border border-orange-100">
              <span>💳 Demo Payment Gateway</span>
            </div>
            <h2 className="text-xl font-black text-gray-950">Complete Session Payment</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Order Breakdown */}
        <div className="mt-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-200 text-xs space-y-2">
          <div className="flex justify-between font-medium text-gray-600">
            <span>Expert:</span>
            <strong className="text-gray-900">{details.expertName} ({details.expertCompany})</strong>
          </div>
          <div className="flex justify-between font-medium text-gray-600">
            <span>Session:</span>
            <span className="font-semibold text-[#FF7A00]">{details.serviceName} ({details.durationMinutes} mins)</span>
          </div>
          <div className="flex justify-between font-medium text-gray-600">
            <span>Scheduled Slot:</span>
            <strong className="text-gray-900">{details.date} at {details.time}</strong>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-sm font-bold text-gray-900">
            <span>Total Payable:</span>
            <span className="text-lg text-[#FF7A00] font-black">
              ₹{details.amountINR.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Failure banner if simulation failed */}
        {failureError && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-red-700">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">✕</span>
              Simulated Payment Failed
            </div>
            <p className="leading-relaxed">{failureError}</p>
            <button
              type="button"
              onClick={() => {
                setSimulateOutcome("success");
                setFailureError(null);
              }}
              className="text-xs font-semibold text-red-700 underline cursor-pointer"
            >
              Switch to Success Mode & Retry
            </button>
          </div>
        )}

        {/* Payment Methods */}
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Choose Payment Method (Demo)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                paymentMethod === "upi"
                  ? "bg-[#FFF7F0] border-[#FF7A00] text-[#FF7A00] ring-2 ring-orange-500/20"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              ⚡ Instant UPI (Fast)
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                paymentMethod === "card"
                  ? "bg-[#FFF7F0] border-[#FF7A00] text-[#FF7A00] ring-2 ring-orange-500/20"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              💳 Debit / Credit Card
            </button>
          </div>

          {paymentMethod === "upi" ? (
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                {(["gpay", "phonepe", "paytm", "custom"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setUpiProvider(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer capitalize ${
                      upiProvider === p
                        ? "bg-[#FF7A00] text-white border-[#FF7A00]"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Demo UPI ID
                </label>
                <input
                  type="text"
                  value={customUpiId}
                  onChange={(e) => setCustomUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  placeholder="e.g. mobile@upi"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Card Number (Pre-filled Demo)
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-center font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Simulation Switcher */}
        <div className="mt-4 p-3 rounded-2xl bg-gray-100/80 border border-gray-200/70 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="font-bold">Test Mode:</span>
            <span className="text-gray-500">Simulate Outcome</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setSimulateOutcome("success");
                setFailureError(null);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                simulateOutcome === "success"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ✓ Success
            </button>
            <button
              type="button"
              onClick={() => {
                setSimulateOutcome("failure");
                setFailureError(null);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                simulateOutcome === "failure"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ✕ Decline (Fail)
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF9029] hover:from-[#e66e00] hover:to-[#FF7A00] disabled:opacity-50 text-white font-bold text-sm rounded-full transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              <span>Pay ₹{details.amountINR.toLocaleString("en-IN")} Now (Demo)</span>
            )}
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            🔒 Simulated sandbox transaction. No real money or card details will be charged.
          </p>
        </div>
      </div>
    </div>
  );
}
