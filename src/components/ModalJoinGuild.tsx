import React from 'react';
import { useContext } from 'react';
import { SessionContext, sysmsg } from 'src/helper/constants';
import { Button } from './button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './dialog';
import { IconButton } from "@modulz/design-system";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as uuid from 'uuid';
import { encode } from 'cbor';

export function ModalJoinGuild() {
    const ctx = useContext(SessionContext);
    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button>Join Guild (BETA)</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Join a guild/server (BETA)</DialogTitle>
                <DialogDescription>
                    Join a guild/server created by your friend! Note this feature is new and buggy.
                </DialogDescription>
                <form
                    onSubmit={(ev) => {
                        ev.preventDefault();

                        if(!ctx.socket) return;

                        let guild_id = (document.getElementById("guildid") as HTMLInputElement).value;
    
                        if (ctx.userData?.guilds.find((g) => g.id === guild_id)) {
                            alert("You dumb bruh you already joined in");
                            return;
                        }

                        ctx.log(sysmsg("Joining guild: " + guild_id, ctx.channel.id));
                        ctx.socket.send(
                            encode({
                                type: "MemberCreate",
                                data: {
                                    guild_id: uuid.parse(guild_id)
                                },
                            })
                        );
                    }}
                >
                    Guild Id<input type="text" id="guildid" />
                    <Button type="submit">Submit</Button>
                </form>
                <DialogClose asChild>
                    <IconButton aria-label="Close">
                    <Cross2Icon />
                    </IconButton>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}