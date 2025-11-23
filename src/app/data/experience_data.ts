import { organization } from "../interfaces/organization";

export const experience_data: organization[] = [
    {
        org_name: "Tata Consultancy Services",
        joined_date: new Date("2021-01-21"),
        end_date: "Present",
        logo_name: "organization_logo/tcs_logo_4.60kb.svg",
        roles: [
            {
                role_name: "System Engineer",
                role_start: new Date("2023-04-01"),
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
            },
            {
                role_name: "Assistant System Engineer",
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
            },
            {
                role_name: "Graduate Trainee",
                role_start: new Date("2021-06-10"),
                role_end: new Date("2021-06-10"),
                tag_line: "Was allocated in TCS Internal Project. Which is e-learning platform named iEvolve",
                projects: [
                    {
                        project_name: "Attrition Analysis",
                        project_content: ["Made a python analysis code which predicted when an employee will leave the company", "I used various algorithms from sklearn library to predict if he will leave on not", "Ended up using random forest since it gave accurate results. We had access to all data like experience, his learnings, domain , age, roles", "We had past data of employess who already left also with there reasons for leaving", " The project was good but the salary data was denied due to security restictions", "The project never went to production, since we were collaborating with HR Team. The development was done Jupyter notebook and we shared the notebook with the HR Team."],
                        tech_stack: ["Python", "Jupyter notebook", "Sklearn"],
                        show: false,
                    },
                    {
                        project_name: "Learning and Recommendation Engine",
                        project_content: ["This is an recommendation engine which recommends courses to users.", "Its takes a single course and recommends 10 other courses similar to it.", "We had data for around 50k courses. The description title, focus area, sub sub focus area, geography, language and many other things.", "I created a bag of words of all of this put it all in word2vec algorithm", "Now for each course the algo gives me numerical vectors now i put it all in a multidimesinal array and pass it in chunks to cosine similaity from sklearn", " So we get simailar courses", " Each course will have its own 49,999 neighbours lined up", "I pick the top closest", "And this is it", "Further i push this in postgres db though procedure for which the data is formatted as sql proc input", "Now the DB developer will write logic like for each employee he will generate recommendation based on unit,grade and past history and other non neccesaary things which are termed as business requirements.", " This is in production running great.", " Its deployed on linux and a bash script is triggered to run it"],
                        tech_stack: ["Python", "Word2Vec", "Sklearn"],
                        show: false
                    },
                    {
                        project_name: "Linkedin Mapping",
                        project_content: ["This is an recommendation engine which recommends courses to users.", "Its takes a single course and recommends 10 other courses similar to it.", "We had data for around 50k courses. The description title, focus area, sub sub focus area, geography, language and many other things.", "I created a bag of words of all of this put it all in word2vec algorithm", "Now for each course the algo gives me numerical vectors now i put it all in a multidimesinal array and pass it in chunks to cosine similaity from sklearn", " So we get simailar courses", " Each course will have its own 49,999 neighbours lined up", "I pick the top closest", "And this is it", "Further i push this in postgres db though procedure for which the data is formatted as sql proc input", "Now the DB developer will write logic like for each employee he will generate recommendation based on unit,grade and past history and other non neccesaary things which are termed as business requirements.", " This is in production running great.", " Its deployed on linux and a bash script is triggered to run it"],
                        tech_stack: ["Python", "Word2Vec", "Sklearn"],
                        show: false
                    },
                ]
            },
            {
                role_name: "Graduate Trainee (Ignite Batch B26)",
                role_start: new Date("2021-01-21"),
                role_end: new Date("2021-06-6"),
                tag_line: "Joined TCS as a fresher. Was trained in TCS Ignite Batch where they tought a lot of new things. Some of the projects are listed below.",
                projects: [
                    {
                        project_name: "Weather and News App",
                        project_content: ["Made a webapp using flask which used Voice Recognition Showed news and weather", ". Which had two modules Weather forecast for next 10 days and current weather which was fetched from api. The app showed different reference images based on weather condition. Eg. Haze so haze image, sunny so sunny", "News app fetched news on the topic searched thorugh search bar. The search bar was made like google and had voice recongiton. The news also had a sentiment analysis which differentaited good bad and neutral news."],
                        tech_stack: ["Python Flask", "HtML", "Jquery", "Apis for Data", "Python libraries for sentiment analysis"],
                        show: false,
                    },
                    {
                        project_name: "Generatives",
                        project_content: ["This project was building about intricate design patterns", "using code and javascript and html canvas", "It used a bunch of alogoithms like fibonacci and other like bezier curve etc etc", "Its was handloom project which generated mesmerizing patterns for sarees. Tata Product which is named as Taneira"],
                        tech_stack: ["Javascript", "HTML"],
                        show: false
                    },
                ]
            }
        ]
    }
];