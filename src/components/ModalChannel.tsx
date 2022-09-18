import React from 'react';
import { useContext } from 'react';
import { SessionContext, sysmsg } from 'src/helper/constants';
import { Button } from './button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './dialog';
import { IconButton } from "@modulz/design-system";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as uuid from 'uuid';
import { encode } from 'cbor';

export function ModalChannel() {
    const ctx = useContext(SessionContext);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Channel</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Create a Channel for your guild/server</DialogTitle>
                <DialogDescription>
                    You can create a text channel for your guild/server... even if you are not creator.
                </DialogDescription>
                <form
                    onSubmit={(ev) => {
                        ev.preventDefault();

                        if(!ctx.socket) return;

                        let name = (document.getElementById("nom") as HTMLInputElement).value;
    
                        ctx.log(sysmsg("Creating channel: " + name, ctx.channel.id));
                        ctx.socket.send(
                            encode({
                                type: "ChannelCreate",
                                data: {
                                    name,
                                    description: (document.getElementById("desc") as HTMLInputElement).value,
                                    position: +(document.getElementById("pos") as HTMLInputElement).value,
                                    guild_id: uuid.parse((document.getElementById("gid") as HTMLInputElement).value)
                                },
                            })
                        );
                    }}
                >
                    Name<input type="text" id="nom" />
                    <br />
                    Description?<input type="text" id="desc" />
                    <br />
                    Position<input type="number" id="pos" />
                    <br />
                    Guild Id<input type="text" id="gid" />
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