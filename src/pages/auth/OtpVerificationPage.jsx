import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const OTP_LENGTH    = 6;
const RESEND_SECS   = 30;

export default function OtpVerificationPage() {
  
  const location              = useLocation();
  const email                 = location.state?.email ?? "your email";

  const [digits, setDigits]   = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer]     = useState(RESEND_SECS);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const formatTimer = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  
  const handleChange = useCallback((index, value) => {
    
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  // Handle paste across all boxes
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) return;
    setLoading(true);
    // TODO: call verify-otp API
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
  };

  // ── Resend ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    // TODO: call resend-otp API
    await new Promise((r) => setTimeout(r, 800));
    setDigits(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_SECS);
    setCanResend(false);
    setResending(false);
    inputRefs.current[0]?.focus();
  };

  const otp         = digits.join("");
  const isComplete  = otp.length === OTP_LENGTH;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Back button ── */}
      <Link
        to="/auth/register"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit"
      >
        <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
        Back to Registration
      </Link>

      {/* ── Heading ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Verify your email
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">{email}</span>.
          Enter it below to continue.
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* OTP boxes */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            One-time code
          </label>
          <div
            className="flex items-center gap-2 sm:gap-3"
            onPaste={handlePaste}
            role="group"
            aria-label="6-digit OTP input"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                pattern="\d"
                maxLength={1}
                value={digit}
                autoFocus={i === 0}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`
                  flex-1 min-w-0 aspect-square max-w-[52px]
                  text-center text-lg font-bold
                  rounded-xl border bg-white dark:bg-gray-900
                  text-gray-900 dark:text-white
                  caret-violet-500
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                  ${digit
                    ? "border-violet-400 dark:border-violet-500 bg-violet-50/40 dark:bg-violet-950/30"
                    : "border-gray-200 dark:border-gray-700"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/30"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-[1rem] animate-spin">
                progress_activity
              </span>
              Verifying…
            </>
          ) : (
            <>
              Verify
              <span className="material-symbols-outlined text-[1rem]">verified</span>
            </>
          )}
        </button>
      </form>

      {/* ── Resend + Timer ── */}
      <div className="flex items-center justify-center gap-1.5 text-sm">
        <span className="text-gray-400 dark:text-gray-500">Didn't receive a code?</span>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50 transition-colors duration-200"
          >
            {resending ? "Resending…" : "Resend OTP"}
          </button>
        ) : (
          <span className="font-semibold tabular-nums text-gray-400 dark:text-gray-500">
            Resend in{" "}
            <span className="text-violet-600 dark:text-violet-400">{formatTimer(timer)}</span>
          </span>
        )}
      </div>

    </div>
  );
}