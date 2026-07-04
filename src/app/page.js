"use client";
import { useState, useEffect } from "react";
import { LOGO_B64 } from "../lib/logo";
import { validateForm, SERVICE_OPTIONS, DEFAULT_SERVICE } from "../lib/validators";

const LANG_MAP = [
  { code: "", label: "English (Original)" },
  { code: "ro", label: "Romanian" },
  { code: "uk", label: "Ukrainian" },
  { code: "ru", label: "Russian" },
  { code: "zh-CN", label: "Chinese" },
  { code: "si", label: "Sinhala" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
  { code: "fil", label: "Filipino" },
  { code: "th", label: "Thai" },
  { code: "id", label: "Indonesian" },
  { code: "vi", label: "Vietnamese" },
];

function handleLangChange(e) {
  const code = e.target.value;
  if (!code) {
    document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "googtrans=;path=/;domain=" + window.location.hostname + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload();
    return;
  }
  document.cookie = "googtrans=/en/" + code + ";path=/";
  document.cookie = "googtrans=/en/" + code + ";path=/;domain=" + window.location.hostname;
  const sel = document.querySelector("#google_translate_element select");
  if (sel) { sel.value = code; sel.dispatchEvent(new Event("change")); }
  else window.location.reload();
}

const WEBHOOK_URL = "https://hook.eu1.make.com/mxzz1t7nf666h6xwyfcg71hat1b8zms2";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#fff;font-family:'Open Sans',sans-serif;color:#222}
  .pw{max-width:600px;margin:0 auto;padding:0 16px 40px}
  .hk-hdr{background:#fff;border-bottom:2px solid #1565c0;padding:14px 24px;display:flex;align-items:center;justify-content:center;position:sticky;top:0;z-index:100}
  .hk-hdr img{height:72px}
  .lang-switch{position:absolute;right:16px;top:50%;transform:translateY(-50%)}
  .lang-switch select{font-size:12px;padding:4px 8px;border-radius:6px;border:1px solid #90caf9;color:#1565c0;font-weight:600;cursor:pointer;font-family:inherit}
  .title-block{padding:28px 0 20px;text-align:center;border-bottom:1px solid #e0e8f5;margin-bottom:24px}
  .title-block h1{font-size:19px;font-weight:700;color:#1565c0;margin-bottom:6px;line-height:1.4}
  .title-block h1.he{direction:rtl;font-size:20px}
  .fc{border:1px solid #cdd8e8;border-radius:6px;overflow:hidden;margin-bottom:20px}
  .fc-body{padding:24px 20px}
  .field{margin-bottom:16px}
  .field label{display:block;font-size:13px;font-weight:600;color:#1565c0;margin-bottom:5px}
  .field input[type=text],.field input[type=tel],.field input[type=email],.field select{width:100%;padding:10px 12px;border:1.5px solid #ccc;border-radius:5px;font-size:14px;font-family:inherit;color:#222;background:#fafafa;outline:none}
  .field select{cursor:pointer}
  .field input:focus,.field select:focus{border-color:#1565c0;background:#fff}
  .field input.err,.field select.err{border-color:#e53935 !important;background:#fff5f5}
  .field .errmsg{color:#e53935;font-size:12px;margin-top:4px}
  .req-star{color:#e53935}
  .file-drop{display:block;border:1.5px dashed #90caf9;border-radius:6px;padding:18px;text-align:center;background:#f8fbff;cursor:pointer;font-size:13px;color:#1565c0;font-weight:600}
  .file-drop.err{border-color:#e53935;background:#fff5f5}
  .file-drop input{display:none}
  .file-name{font-size:12px;color:#1565c0;font-weight:600;margin-top:8px;word-break:break-all}
  .err-banner{background:#ffebee;border:1px solid #ef9a9a;border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#c62828;line-height:1.6}
  .err-banner strong{display:block;margin-bottom:4px}
  .btn-submit{width:100%;padding:13px;border:none;border-radius:6px;background:#1565c0;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:8px}
  .btn-submit:hover{background:#0d47a1}
  .btn-submit:disabled{background:#cfd8e3;color:#94a3b8;cursor:not-allowed}
  .success{text-align:center;padding:50px 20px}
  .success .icon{font-size:56px;margin-bottom:16px;color:#2e7d32}
  .success h2{font-size:20px;font-weight:700;color:#2e7d32;margin-bottom:10px}
  .success p{font-size:13px;color:#555;line-height:1.7}
  .hk-ftr{background:#f0f4f8;border-top:2px solid #1565c0;padding:18px 24px;text-align:center;font-size:11px;color:#555;line-height:1.8;margin-top:16px}
  .hk-ftr p{margin-bottom:3px}
`;

const INITIAL = { name: "", passportId: "", phone: "", email: "", service: DEFAULT_SERVICE };

function Header({ showTranslate }) {
  useEffect(() => {
    if (!showTranslate) return;
    if (window.googleTranslateElementInit) return;
    document.documentElement.lang = "en";
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "ro,uk,ru,zh-CN,si,hi,ar,fil,th,id,vi",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, "google_translate_element");
    };
    const s = document.createElement("script");
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&hl=en";
    s.async = true;
    document.head.appendChild(s);
  }, [showTranslate]);

  return (
    <div className="hk-hdr">
      <img src={LOGO_B64} alt="Hakeren" />
      {showTranslate && (
        <div className="lang-switch">
          <div id="google_translate_element" className="notranslate" translate="no" style={{ position: "absolute", left: "-9999px" }} />
          <select className="notranslate" translate="no" onChange={handleLangChange}>
            {LANG_MAP.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <div className="hk-ftr">
      <p>All calculation forms for foreign workers' rights in Israel created by the Foundation are exclusively owned and protected by copyright.</p>
      <p>All rights reserved by the Israeli Foundation for Foreign Worker Rights. (C)</p>
      <p>All forms for Social Benefits Calculation for foreign workers in Israel created by Hakeren are proprietary and copyrighted materials. Any unauthorized reproduction, copying, or duplication of content from this website or the forms provided is strictly prohibited. Hakeren reserves all rights. (C)</p>
    </div>
  );
}

export default function Home() {
  const [f, setF] = useState(INITIAL);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    const currentErrors = validateForm({ ...f, file });
    setErrors(currentErrors);
    setShowErrors(true);
    if (Object.keys(currentErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append("name", f.name);
      formData.append("passportId", f.passportId);
      formData.append("phone", f.phone);
      formData.append("email", f.email || "");
      formData.append("service", f.service);
      formData.append("file", file);

      const res = await fetch(WEBHOOK_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Something went wrong while submitting the form. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <Header />
        <div className="pw">
          <div className="success">
            <div className="icon">&#10003;</div>
            <h2>Form submitted successfully</h2>
            <p>Your payment proof has been received.<br />Our team will review it shortly.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Header showTranslate />
      <div className="pw">
        <div className="title-block">
          <h1 className="he">טופס העלאת תשלום העברה בנקאית</h1>
          <h1>Bank Transfer Payment Upload Form</h1>
          <h1>Форма загрузки банковского перевода</h1>
        </div>

        {submitError && (
          <div className="err-banner">
            <strong>Submission failed</strong>
            {submitError}
          </div>
        )}

        <div className="fc">
          <div className="fc-body">
            <div className="field">
              <label>Full name / שם מלא<span className="req-star"> *</span></label>
              <input
                type="text"
                className={showErrors && errors.name ? "err" : ""}
                value={f.name}
                onChange={e => set("name", e.target.value)}
                placeholder="Full name"
              />
              {showErrors && errors.name && <p className="errmsg">{errors.name}</p>}
            </div>

            <div className="field">
              <label>Passport/ID / דרכון / ת.ז.<span className="req-star"> *</span></label>
              <input
                type="text"
                className={showErrors && errors.passportId ? "err" : ""}
                value={f.passportId}
                onChange={e => set("passportId", e.target.value)}
                placeholder="Passport or ID number"
              />
              {showErrors && errors.passportId && <p className="errmsg">{errors.passportId}</p>}
            </div>

            <div className="field">
              <label>Phone / טלפון<span className="req-star"> *</span></label>
              <input
                type="tel"
                className={showErrors && errors.phone ? "err" : ""}
                value={f.phone}
                onChange={e => set("phone", e.target.value)}
                placeholder="05X-XXXXXXX"
                maxLength={12}
              />
              {showErrors && errors.phone && <p className="errmsg">{errors.phone}</p>}
            </div>

            <div className="field">
              <label>Email / אימייל</label>
              <input
                type="email"
                className={showErrors && errors.email ? "err" : ""}
                value={f.email}
                onChange={e => set("email", e.target.value)}
                placeholder="you@example.com"
              />
              {showErrors && errors.email && <p className="errmsg">{errors.email}</p>}
            </div>

            <div className="field">
              <label>Which service is this for? / עבור איזה שירות<span className="req-star"> *</span></label>
              <select
                className={showErrors && errors.service ? "err" : ""}
                value={f.service}
                onChange={e => set("service", e.target.value)}
              >
                {SERVICE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {showErrors && errors.service && <p className="errmsg">{errors.service}</p>}
            </div>

            <div className="field">
              <label>Payment proof file / קובץ אישור תשלום<span className="req-star"> *</span></label>
              <label className={`file-drop${showErrors && errors.file ? " err" : ""}`}>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                {file ? "Click to change file" : "Click to select an image or PDF (max 20MB)"}
                {file && <div className="file-name">{file.name}</div>}
              </label>
              {showErrors && errors.file && <p className="errmsg">{errors.file}</p>}
            </div>

            <button className="btn-submit" disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Submitting..." : "Submit Payment Proof"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
