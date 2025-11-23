import { organization } from "../interfaces/organization";

export const college_data: organization[] = [
    {
        org_name: "Savitribai Phule Pune University",
        joined_date: new Date("2017-06-15"),
        end_date: new Date("2022-09-10"),
        logo_name: "organization_logo/sppu_logo15.5kb.webp",
        roles: [
            {
                role_name: "Masters In Computer Science",
                role_start: new Date("2023-04-01"),
                role_end: "Present",
                tag_line: "ss",
                projects: [
                    {
                        project_name: "Migration",
                        project_content: ["hello", "world"],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                    }
                ]
            },
            {
                role_name: "Bachelor In Computer Science",
                role_start: new Date("2023-04-21"),
                role_end: "Present",
                tag_line: "ss",
                projects: [
                    {
                        project_name: "Migration",
                        project_content: ["hello", "world"],
                        tech_stack: ["Java", "Angular"],
                        show: false,
                    },
                    {
                        project_name: "Migration",
                        project_content: ["hello", "world"],
                        tech_stack: ["Java", "Angular"],
                        show: false
                    },
                ]
            }
        ]
    }
];