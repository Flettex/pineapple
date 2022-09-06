// import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from 'swr';

//(props: InferGetServerSidePropsType<typeof getServerSideProps>

const fetcher = (url: string) => fetch(url).then(r => r.text());

export default function Login() {
    const { data } = useSWR("/api/login", fetcher);
    const Router = useRouter();
    function gebi(id: string): HTMLInputElement {
        return document.getElementById(id) as HTMLInputElement;
    }
    return (
        <>
            <form id="frm" onSubmit={(e) => {
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
                    })
                }).then((res) => {
                    if (res.ok) {
                        Router.push("/chat");
                    }
                });
            }}>
                <input id="e" type="email" placeholder="Type an email" required />
                <input id="p" type="password" placeholder="Type a password" required />
                <input id="captcha" type="text" placeholder="captcha" required />
                { data && <Image src={data} alt="captcha" width="130" height="50" />}
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