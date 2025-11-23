import { roles } from "./roles";

export interface organization {
	org_name: string,
	joined_date: Date,
	end_date: Date | string,
	logo_name: string,
	roles: roles[]
}
