import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Box } from "../components/box";
import { Button, ButtonGroup } from "../components/button";
import { Modal, ModalBody, ModalField, ModalTrigger } from "../components/modal";
import * as uuid from 'uuid';
import { encode, decode } from 'cbor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tab";
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogTitle, DialogClose } from "../components/dialog";
import { IconButton } from "@modulz/design-system";
import { Cross2Icon } from "@radix-ui/react-icons";
interface IMessage {
	id: string,
	content: string,
	created_at: number,
	edited_at: number,
	author: IUser,
	channel_id: string,
	nonce?: string,
}

interface IChannel {
	id: string, // uuid
	name: string,
	description?: string,
	position: number,
	created_at: number, // number
	guild_id: string, // uuid, useless but too lazy to remove it
}

interface IUser {
	id: bigint,
	username: string,
	profile?: string,
	created_at: number, // time
	description?: string,
	is_staff: boolean,
	is_superuser: boolean
}

interface IMember {
	id: string,
	nick_name: string | undefined,
	join_at: number,
	guild_id: string,
	user_id: bigint,
}

interface IGuild {
	id: string, // uuid
	name: string,
	description?: string,
	icon?: string,
	created_at: number, // time
	creator_id: number,
	channels: IChannel[],
	members: IMember[]
}

interface IUserData {
	user: {
		id: bigint,
		username: string,
		email: string,
		profile?: string,
		created_at: number, // time
		description?: string,
		allow_login: boolean,
		is_staff: boolean,
		is_superuser: boolean
	},
	guilds: IGuild[]
}


const MAIN_CHANNEL: IChannel = {
	id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
	name: "Main",
	position: -1,
	created_at: 0,
	guild_id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce"
}

const MAIN_GUILD: IGuild = {
	id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
	name: "Main",
	created_at: 0,
	creator_id: -1,
	channels: [MAIN_CHANNEL],
	members: []
}

const SYSTEM_AUTHOR: IUser = {
	id: BigInt(0),
	username: "System",
	created_at: 1467969011,
	is_staff: true,
	is_superuser: true
}

function sysmsg(content: string, id: string): IMessage {
	return {
		id: "",
		content: content,
		created_at: 0,
		edited_at: 0,
		channel_id: id,
		author: SYSTEM_AUTHOR,
		nonce: ""
	}
}

export default function Chat() {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [disconnecting, setDisconnecting] = useState<boolean>(false);
	const [logs, setLogs] = useState<{
        [key: string]: IMessage[]
    }>({});
	const [userData, setUserData] = useState<IUserData | null>(null);
	const [userCache, setUserCache] = useState<{
		[key: string]: IUser | { id: bigint }
	}>({
		"0": SYSTEM_AUTHOR
	});
	const fetched = useRef<{
		channels: string[],
		guilds: string[],
		users: bigint[]
	}>({
		channels: [],
		guilds: [],
		users: []
	});
	const [guild, setGuild] = useState<IGuild>(MAIN_GUILD);
    const [channel, setChannel] = useState<IChannel>(MAIN_CHANNEL);
	const statusRef = useRef<HTMLSpanElement | null>(null);
	const textInputRef = useRef<HTMLInputElement | null>(null);
	const nameRef = useRef<HTMLInputElement | null>(null);
	// useEffect(() => {
	// 	console.log(userData);
	// }, [userData]);
	function fix(o: any): object {
		for (let [k, v] of Object.entries(o)) {
			if (ArrayBuffer.isView(v)) {
				o[k] = uuid.stringify(v as Uint8Array);
			} else if (typeof v === "object" && !Array.isArray(v) && v !== null) {
				o[k] = fix(v);
			} else if (Array.isArray(v)) {
				v.forEach((e, ind) => {
					o[k][ind] = fix(e);
				});
			}
		}
		return o;
	}
	useEffect(() => {
		if (socket) {
			socket.onopen = () => {
				log(sysmsg("Connected", channel.id));
			};

			socket.onmessage = (ev) => {
				// console.log(ev);
				const event = decode(ev.data);
				for (let [k, v] of Object.entries(event.data)) {
					if (ArrayBuffer.isView(v)) {
						event.data[k] = uuid.stringify(v as Uint8Array);
					} else if (typeof v === "object" && !Array.isArray(v) && v !== null) {
						event.data[k] = fix(v);
					} else if (Array.isArray(v)) {
						v.forEach((e, ind) => {
							event.data[k][ind] = fix(e);
						});
					}
				}
				// console.log(event);
				// console.log(event.data);
				// const event = JSON.parse(ev.data);
				if (event.type === "MemberCreate") {
					setUserData(usrd => {
						if (!usrd) return null;
						let newGuilds = [...(usrd.guilds as IGuild[])];
						let found = newGuilds.findIndex((g) => g.id === event.data.guild.id);
						if (found !== -1) {
							newGuilds[found] = {
								...newGuilds[found],
								members: [...newGuilds[found].members, {
									...event.data.member,
									user_id: BigInt(event.data.member.user_id)
								}]
							}
						} else {
							// console.log("omg!11! new??");
							newGuilds.push({
								...event.data.guild,
								members: []
							});
						}
						return {
							user: usrd.user,
							guilds: newGuilds
						}
					});
				} else if (event.type === "MemberRemove") {
					// broken atm
				} else if (event.type === "MessageUpdate") {
					setLogs(logs => {
						return {
							...logs,
							[event.data.channel_id]: [...(logs[event.data.channel_id] ?? [])].map((m) => {
								if (m.id === event.data.id) {
									event.data.nonce = undefined;
									event.data.received = true;
									return event.data;
								}
								return m;
							})
						}
					});
				} else if (event.type === "MessageCreate") {
					// console.log(event.data);
					// console.log(JSON.stringify(event.data.author), userData?.user.id);
					if (event.data.author.id === Number(userData?.user.id || -1)) {
						setLogs(logs => {
							// find the message with the nonce
							return {
								...logs,
								[event.data.channel_id]: [...(logs[event.data.channel_id] ?? [])].map((m) => {
									if (m.nonce === event.data.nonce) {
										return event.data;
									}
									return m;
								})
							}
						});
					} else {
						try_user(event.data.author.id);
						log(event.data);
					}
				} else if (event.type === "GuildCreate") {
					setUserData(usrd => ({
						user: usrd!.user,
						guilds: [...(usrd!.guilds as IGuild[]), {...event.data.guild, channels: event.data.guild.channels ?? [], members:  event.data.guild.members ?? []}]
					}));
				} else if (event.type === "ChannelCreate") {
					setUserData(usrd => ({
						user: usrd!.user,
						guilds: [...(usrd!.guilds as IGuild[])].map((g) => g.id === event.data.channel.guild_id
							? {
								...g,
								channels: [...(g.channels ?? []), event.data.channel]
							} : {
								...g
							}
						)
					}));
				} else if (event.type === "ReadyEvent") {
					setUserData({
						user: {
							...event.data.user,
							id: BigInt(event.data.user.id)
						},
						guilds: event.data.guilds.map((g: IGuild) => {
							// console.log(g.id, stringify(g.id as any));
							return {
								...g,
								members: []
							}
						})
					});
					setUserCache(cache => ({
						...cache,
						[event.data.user.id+""]: event.data.user
					}));
				} else if (event.type === "Messages") {
					setLogs((logs) => ({
						...logs,
						[event.data.channel_id]: [...(logs[event.data.channel_id] || []), ...event.data.messages.map((m: any) => {
							// console.log("AUTHOR_ID:", m.author_id);
							return {
								id: m.id,
								content: m.content,
								// content: (userData!.guilds.find((g) => 
								// 	g.channels.find((c) => c === event.data.channel_id) ? true : false)
								// 		?.members.find((mem) => mem.user_id === m.author_id)
								// 			?.nick_name ?? ([try_user(m.author_id), userCache[m.author_id]][1] as IUser | undefined)?.username ?? m.author_id) + ": " + m.content,
								created_at: m.created_at,
								edited_at: m.edited_at,
								channel_id: m.channel_id,
								author: [try_user(m.author_id), {
									id: BigInt(m.author_id)
								}][1]
							}
						})]
					}));
				} else if (event.type === "Members") {
					setUserData(usrd => {
						let newGuilds = [...(usrd!.guilds as IGuild[])];
						let found = newGuilds.findIndex((g) => g.id === event.data.guild_id);
						if (found !== -1) {
							newGuilds[found] = {
								...newGuilds[found],
								members: [...newGuilds[found].members, ...event.data.members.map((m: any) => ({
									...m,
									user_id: BigInt(m.user_id)
								}))]
							}
						} else {
							throw new Error("Bro wtf receiving members event before the guild initialized dude what");
						}
						return {
							user: usrd!.user,
							guilds: [...(usrd!.guilds as IGuild[])]
						}
					});
				} else if (event.type === "UserFetch") {
					setUserCache(cache => ({...cache, [event.data.id+""]: event.data}));
				} else {
					console.log("Unhandled event", event.type, "Data: ", event.data);
				}
			};

			socket.onclose = () => {
				log(sysmsg("Disconnected", channel.id));
				setSocket(null);
				setDisconnecting(false);
			};
		}
		if (!statusRef.current || !textInputRef.current) return;
		if (socket) {
			statusRef.current.style.backgroundColor = "transparent";
			statusRef.current.style.color = "green";
			statusRef.current.textContent = `connected`;
			textInputRef.current.focus();
		} else {
			statusRef.current.style.backgroundColor = "red";
			statusRef.current.style.color = "white";
			statusRef.current.textContent = "disconnected";
		}
	}, [socket, channel, disconnecting, userData?.user]);

	useEffect(() => {
		if (socket) {
			if (channel.id == MAIN_CHANNEL.id) return;
			if (!fetched.current.channels.includes(channel.id)) {
				socket.send(encode({
					type: "MessageFetch",
					data: {
						channel_id: uuid.parse(channel.id)
					}
				}));
				fetched.current.channels.push(channel.id);
			}
		}
	}, [channel]);

	useEffect(() => {
		if (socket) {
			if (guild.id == MAIN_GUILD.id) return;
			if (!fetched.current.guilds.includes(guild.id)) {
				socket.send(encode({
					type: "MemberFetch",
					data: {
						guild_id: uuid.parse(guild.id)
					}
				}));
				fetched.current.guilds.push(guild.id);
			}
		}
	}, [guild]);

	async function connect() {
		if (socket) {
			if (disconnecting) {
				alert("Be patient I'm tryna disconnect");
				return;
			}
			setDisconnecting(true);
			log(sysmsg("Disconnecting...", channel.id));
			socket.close();
		} else {
			// const { location } = window;

			// await fetch("/api/samesite");
			// const proto = location.protocol.startsWith("https") ? "wss" : "ws";
			// const wsUri = "ws://localhost:8080/ws";
			const wsUri = process.env.NODE_ENV === "development" ? "ws://localhost:8080/ws" : "wss://flettex-backend.fly.dev/ws";

			log(sysmsg("Connecting...", channel.id));
			let websocket = new WebSocket(wsUri);
			websocket.binaryType = "arraybuffer"
			setSocket(websocket);
		}
	}

	function try_user(id: bigint) {
		if (userCache.hasOwnProperty(id+"")) return;
		if (fetched.current.users.includes(id)) return;
		setUserCache(cache => {
			if (cache.hasOwnProperty(id+"") && !userCache.hasOwnProperty(id+"") && !fetched.current.users.includes(id)) {
				fetched.current.users.push(id);
				socket?.send(encode({
					type: "UserFetch",
					data: {
						id
					}
				}));
			}
			return {
				...cache,
				[id+""]: {
					id
				}
			}
		});
	}

	function log(msg: IMessage): void {
        // console.log("Channel", msg.channel_id);
		setLogs((logs) => ({
            ...logs,
            [msg.channel_id]: [...(logs[msg.channel_id] ?? []), msg]
        }));
	}

	return (
		<>
			<div>
				<Button onClick={connect}>
					{socket ? "Disconnect" : "Connect"}
				</Button>
				<div>GUILD: {guild.name} {guild.id}</div>
                <div>CHANNEL: {channel.name} {channel.id}</div>
				<span>Status:</span>
				<span ref={statusRef}>disconnected</span>
			</div>

			<div>{JSON.stringify(userCache[1])}</div>
			<Box css={{}}>
				<Tabs defaultValue={MAIN_CHANNEL.id} orientation="horizontal">
					<TabsList aria-label="choose a guild">
						<TabsTrigger value={MAIN_CHANNEL.id} onClick={() => [setChannel(MAIN_CHANNEL), setGuild(MAIN_GUILD)]}>Main</TabsTrigger>
						{
							userData && userData.guilds.map((g) => (
								<TabsTrigger
									key={g.id}
									value={g.id}
									onClick={() => [setGuild(g), setChannel(userData.guilds?.find((gd) => gd.id == g.id)?.channels?.[0] || MAIN_CHANNEL)]}
								>
									{g.icon ? <Image src={g.icon} alt={g.name} width={50} height={50} /> : g.name}
								</TabsTrigger>
							))
						}
					</TabsList>
					<TabsContent value={MAIN_CHANNEL.id}>
						{logs[MAIN_CHANNEL.id]?.map((i, ind) => <div key={ind} style={{color: i.author.id === userData?.user.id ? (i.id !== "NOT_RECEIVED" ? undefined : "gray") : undefined}}>
						{(userCache[i.author.id+""] as IUser)?.username}: {i.content} {i.created_at !== i.edited_at && "(edited)"}</div>)}
					</TabsContent>
					{
						userData && userData.guilds.map((g) => (
							<TabsContent
								key={g.id}
								value={g.id}
								onClick={() => [setGuild(g), setChannel(userData.guilds?.find((gd) => gd.id == g.id)?.channels?.[0] || MAIN_CHANNEL)]}
							>
								<Box css={{}}>
									<Tabs defaultValue={g.channels?.[0].id} orientation="horizontal">
										<TabsList aria-label="choose a guild">
											{
												userData && userData.guilds.find((g) => g.id === guild.id)?.channels?.map((c) => (
													<TabsTrigger
														value={c.id}
														key={c.id}
														onClick={() => setChannel(c)}
													>
														{c.name}
													</TabsTrigger>
												))
											}
										</TabsList>
										{
											Object.entries(logs).map(([k, m]: [string, IMessage[]]) => (
												<TabsContent
													key={k}
													value={k}
												>
													{
														m.map((i, ind) => <div key={ind} style={{color: i.author.id === userData?.user.id ? (i.id !== "NOT_RECEIVED" ? undefined : "gray") : undefined}} onDoubleClick={() => {
																if (i.author.id !== BigInt(userData?.user.id as bigint) || i.channel_id == MAIN_CHANNEL.id) return;
																const inp = prompt("New content");
																if (!inp) return;
																socket?.send(
																	encode({
																		type: "MessageUpdate",
																		data: {
																			id: uuid.parse(i.id),
																			content: inp,
																			nonce: uuid.parse(i.nonce || MAIN_GUILD.id)
																		},
																	})
																);
															}}>{(userCache[i.author.id+""] as IUser)?.username}: {i.content} {i.created_at !== i.edited_at && "(edited)"}</div>
														)
													}
												</TabsContent>
											))
										}
									</Tabs>
								</Box>
							</TabsContent>
						))
					}
				</Tabs>
			</Box>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();

					if (!textInputRef.current || !socket) return;

					const text = textInputRef.current.value;

					const nonce = uuid.v4();

					log({
						id: "NOT_RECEIVED",
						content: text,
						created_at: Date.now(),
						edited_at: Date.now(),
						author: userData?.user || SYSTEM_AUTHOR,
						channel_id: channel.id,
						nonce
					});
					socket.send(
						encode({
							type: "MessageCreate",
							data: {
								content: text,
								channel_id: channel.id,
								nonce: uuid.parse(nonce)
							},
						})
					);

					textInputRef.current.value = "";
					textInputRef.current.focus();
				}}
			>
				<input type="text" ref={textInputRef} />
				<Button type="submit">Submit</Button>
			</form>
			<ButtonGroup>
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

								if(!nameRef.current || !socket) return;
			
								const name = nameRef.current.value;
			
								log(sysmsg("Creating guild: " + name, channel.id));
								socket.send(
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
							<DialogClose><Button type="submit">Submit</Button></DialogClose>
						</form>
						<DialogClose asChild>
							<IconButton aria-label="Close">
							<Cross2Icon />
							</IconButton>
						</DialogClose>
					</DialogContent>
				</Dialog>
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

								if(!socket) return;

								let name = (document.getElementById("nom") as HTMLInputElement).value;
			
								log(sysmsg("Creating channel: " + name, channel.id));
								socket.send(
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

								if(!socket) return;

								let guild_id = (document.getElementById("guildid") as HTMLInputElement).value;
			
								if (userData?.guilds.find((g) => g.id === guild_id)) {
									alert("You dumb bruh you already joined in");
									return;
								}

								log(sysmsg("Joining guild: " + guild_id, channel.id));
								socket.send(
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
							<DialogClose><Button type="submit">Submit</Button></DialogClose>
						</form>
						<DialogClose asChild>
							<IconButton aria-label="Close">
							<Cross2Icon />
							</IconButton>
						</DialogClose>
					</DialogContent>
				</Dialog>
			</ButtonGroup>

			<hr />

			<section>
				<h1>Commands are currently <span style={{color: 'red', display: 'inline-block'}}>DEPRECATED.</span></h1>
				{/* <h2>Commands</h2> */}
				{/* <table>
					<tbody>
						<tr>
							<td>
								<code>/list</code>
							</td>
							<td>list all available rooms (DEV ONLY)</td>
						</tr>
						<tr>
							<td>
								<code>/join name</code>
							</td>
							<td>
								<p style={{color: 'red', display: 'inline-block'}}>!deprecated!</p> join room, if room does not exist, create new one
							</td>
						</tr>
						<tr>
							<td>
								<code>/leave name</code>
							</td>
							<td>
								<p style={{color: 'red', display: 'inline-block'}}>!deprecated!</p> {"leave room, ignored if you are not a part of the room / room doesn't exist (can't leave main room)"}
							</td>
						</tr>
						<tr>
							<td>
								<code>/name name</code>
							</td>
							<td>
							<p style={{color: 'red', display: 'inline-block'}}>!deprecated! removing soon</p> change your global nickname
							</td>
						</tr>
						<tr>
							<td>
								<code>some message</code>
							</td>
							<td>
								just string, send message to all peers in same room
							</td>
						</tr>
					</tbody>
				</table> */}
			</section>
		</>
	);
}
