// import { GetServerSideProps, InferGetServerSidePropsType } from "next";
// import Image from "next/image";
import { useRouter } from "next/router";
// import useSWR from 'swr';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useState } from "react";

//(props: InferGetServerSidePropsType<typeof getServerSideProps>

// const fetcher = (url: string) => fetch(url, {
//     credentials: 'include'
// }).then(r => r.text());

export default function Login() {
    // const { data } = useSWR("/api/login", fetcher);
    const [verified, setVerified] = useState<boolean>(false);
    const Router = useRouter();
    function gebi(id: string): HTMLInputElement {
        return document.getElementById(id) as HTMLInputElement;
    }
    return (
        <>
            <form id="frm" onSubmit={(e) => {
                if (!verified) {
                    alert("Please complete captcha first");
                    return;
                }
                e.preventDefault();
                fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: gebi("e")?.value,
                        password: gebi("p")?.value,
                        code: gebi("captcha")?.value
                    }),
                    credentials: 'include'
                }).then((res) => {
                    if (res.ok) {
                        Router.push("/chat");
                    }
                });
            }}>
                <input id="e" type="email" placeholder="Type an email" required />
                <input id="p" type="password" placeholder="Type a password" required />
                <input id="captcha" type="text" placeholder="captcha" required />
                <HCaptcha
                    sitekey="b06e23a9-c61e-485e-a472-4b7d2e8077d2"
                    onVerify={_ => setVerified(true)}
                />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//     const captcha = await fetch("http://localhost:8080/login");
//     return {
//         props: {
//             imgSrc: await captcha.text()
//         }
//     }
//   }