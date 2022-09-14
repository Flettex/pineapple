import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef, useState } from "react";

export default function Login() {
    const [verified, setVerified] = useState<boolean>(false);
    const captchaRef = useRef<HCaptcha>(null);
    return (
        <>
            <form id="frm" onSubmit={(e) => {
                if (!verified) {
                    alert("Do the captcha bruh");
                    return;
                }
                e.preventDefault();
                alert("Congrats you're not a robot");
            }}>
                <HCaptcha
                    ref={captchaRef}
                    sitekey="b06e23a9-c61e-485e-a472-4b7d2e8077d2"
                    onVerify={_ => {
                        setVerified(true);
                        captchaRef?.current?.execute();
                    }}
                />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}