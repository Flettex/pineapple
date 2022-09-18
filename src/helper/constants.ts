import React from 'react';

interface ISessionContext {
	socket: WebSocket | null,
	setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
	log: (msg: IMessage) => void,
    channel: IChannel,
    setChannel: React.Dispatch<React.SetStateAction<IChannel>>,
    userData: IUserData | null,
    setUserData: React.Dispatch<React.SetStateAction<IUserData | null>>,
}

export const SessionContext = React.createContext<ISessionContext>({} as any);

export function sysmsg(content: string, id: string): IMessage {
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

export interface IMessage {
	id: string,
	content: string,
	created_at: number,
	edited_at: number,
	author: IUser,
	channel_id: string,
	nonce?: string,
}

export interface IChannel {
	id: string, // uuid
	name: string,
	description?: string,
	position: number,
	created_at: number, // number
	guild_id: string, // uuid, useless but too lazy to remove it
}

export interface IUser {
	id: bigint,
	username: string,
	profile?: string,
	created_at: number, // time
	description?: string,
	is_staff: boolean,
	is_superuser: boolean
}

export interface IMember {
	id: string,
	nick_name: string | undefined,
	join_at: number,
	guild_id: string,
	user_id: bigint,
}

export interface IGuild {
	id: string, // uuid
	name: string,
	description?: string,
	icon?: string,
	created_at: number, // time
	creator_id: number,
	channels: IChannel[],
	members: IMember[]
}

export interface IUserData {
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

export const MAIN_CHANNEL: IChannel = {
	id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
	name: "Main",
	position: -1,
	created_at: 0,
	guild_id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce"
}

export const MAIN_GUILD: IGuild = {
	id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
	name: "Main",
	created_at: 0,
	creator_id: -1,
	channels: [MAIN_CHANNEL],
	members: []
}

export const SYSTEM_AUTHOR: IUser = {
	id: BigInt(0),
	username: "System",
	created_at: 1467969011,
	is_staff: true,
	is_superuser: true
}