import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef, useState } from "react";

export default function Login() {
    const [counter, setCounter] = useState<number>(0);
    const captchaRef = useRef<HCaptcha>(null);
    return (
        <>
            <p>SOLVED: {counter}</p>
            <HCaptcha
                ref={captchaRef}
                sitekey="b06e23a9-c61e-485e-a472-4b7d2e8077d2"
                onVerify={_ => {
                    setCounter(c => c+1);
                    captchaRef?.current?.execute();
                }}
            />
        </>
    )
}