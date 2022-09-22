// import { TextField, Text, Grid } from "@modulz/design-system";
// import { globalStyles } from "@styled";
import Link from "next/link";
// import CheckboxDemo from "../components/checkbox";
// import DialogDemo from "../components/dialog";
// import PopoverDemo from "../components/popover";
// import TabsDemo from "../components/tab";
// import { ButtonGroup, Button } from "../components/button";
// import { Checkbox } from "../components/checkbox";
// import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";

export default function Home() {
    // globalStyles();
    return (
        <>
            {/* <PopoverDemo />
            <CheckboxDemo />
            <DialogDemo />
            <TabsDemo />
            <Grid
                align="center"
                css={{ gridTemplateColumns: 'auto 1fr', columnGap: '$5', rowGap: '$1', mb: '$2' }}
            >
                <Text size="1">Name</Text>
                <TextField defaultValue="" />
                <Text size="1">Username</Text>
                <TextField defaultValue="" />
            </Grid> */}
            <h1>
                {"Welcome to extremely low budget chat app."}
                {"We are open source and non-profit"}
            </h1>
            <Link href="/chat"><a>{"Me when I want to try this trash chat app I'm probably never using ever again"}</a></Link>
            <br />
            <Link href="/login"><a>{"Me when login"}</a></Link>
            <br />
            <Link href="/signup"><a>{"Me when signup"}</a></Link>
            <br />
            <Link href="/logout"><a>{"Don't logout bro alts aren't allowed"}</a></Link>
        </>
    )
}

// export default function Home() {
//     globalStyles()
//     return (
//         <>
//             <Popover>
//                 <PopoverTrigger>
//                     Trigger
//                 </PopoverTrigger>
//                 <PopoverContent>
//                     Hello
//                 </PopoverContent>
//             </Popover>
//             <Button onClick={() => alert("test")}>Test</Button>
//             <ButtonGroup css={{
//                 flexDirection: 'row'
//             }}>
//                 <Button>
//                     Balls0
//                 </Button>
//                 <Button>
//                     Balls1
//                 </Button>
//                 <Button>
//                     Balls2
//                 </Button>
//             </ButtonGroup>
//             <Checkbox type="checkbox" id="chk" />
//         </>
//     );
// }