import React, { useRef } from 'react';
import { useContext } from 'react';
import { SessionContext, sysmsg } from 'src/helper/constants';
import { Button } from './button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './dialog';
import { IconButton } from "@modulz/design-system";
import { Cross2Icon } from "@radix-ui/react-icons";
import { encode } from 'cbor';

export function ModalGuild() {
  const ctx = useContext(SessionContext);
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button>Create Guild</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a new guild/server</DialogTitle>
        <DialogDescription>
          You can create a new guild/server
        </DialogDescription>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();

            if(!nameRef.current || !ctx.socket) return;
  
            const name = nameRef.current.value;
  
            ctx.log(sysmsg("Creating guild: " + name, ctx.channel.id));
            ctx.socket.send(
              encode({
                type: "GuildCreate",
                data: {
                  name,
                  description: (document.getElementById("d") as HTMLInputElement).value,
                  icon: (document.getElementById("ic") as HTMLInputElement).value
                },
              })
            );
          }}
        >
          Name<input type="text" ref={nameRef} />
          <br />
          Description?<input type="text" id="d" />
          <br />
          Icon?<input type="text" id="ic" />
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
