const express = require('express');// biblioteca para criar servidor
const routes = express.Router(); // é uma parte da biblioteca responsavel por criar os caminhos

//usando template engine
const views = __dirname + "/views/"

const Job = {
    data:[
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 60,
            created_at: Date.now(),//Atribuir uma nova data
            
          
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 2,
            created_at: Date.now()//Atribuir uma nova data
            
        }
    ],
    controlers:{
        index(req,res){
                const updatedJobs = Job.data.map((job)=>{
                    const remaining = Job.services.remainingDays(job)
                    const status = remaining<= 0 ?'done': 'progress'
            
                    return {
                        ...job,
                        remaining,
                        status,
                        budget: Profile.data["value-hour"] * job["total-hours"]
                    }
                })
                return res.render(views + "index",{jobs:updatedJobs})
        },
        save(req, res) {
            const lastId = Job.data[Job.data.length - 1] ? Job.data[Job.data.length - 1].id : 1
        
            Job.data.push({
                id:lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at:Date.now()//Atribuir uma nova data
            })
            return res.redirect('/')
        },
        create(req, res) {
          return  res.render( views + "job")
        },
    

    },
    services: {
        remainingDays(job){
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
                const createdDate = new Date(job.created_at)
                const dueDay = createdDate.getDate() + Number(remainingDays)
                const dueDate = createdDate.setDate(dueDay)//setDate setar uma data em milisegundos
                
                const timeDiffInMs = dueDate - Date.now()
                //transformar milisegundos em dias
                const dayInMs = 1000 * 60 * 60 *24 
                const dayDiff = Math.floor(timeDiffInMs/dayInMs)
                //restam x dias
                return dayDiff
        },

    },
}

const Profile ={
    data: {
            name: 'Aurélio Mesquita',
            avatar: 'https://avatars.githubusercontent.com/u/39443258?v=4',
            "monthly-budget": 3000,
            "days-per-week": 5,
            "hours-per-day": 5,
            "vacation-per-year":4,
            "value-hour":56
    },
    controlers: {
        index(req, res){
           return  res.render(views +  "profile", {profile: Profile.data})

        },
        update(req, res){
            //req.body para pegar 
            const data = req.body

            //definir quantas semanas tem o ano 
            const weeksPerYear = 52

            //remover as semanas de ferias do ano para pegar quantas semans tem 1 mes
            const weeksPerMount = (weeksPerYear - data["vacation-per-year"]) / 12

            //total de horas trabalhadas na semana 
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            //horas trabalhadas no mes
            const mountlyTotalHours = weekTotalHours * weeksPerMount

            //valor da hora 
            const valueHours = data["value-hour"] =  data["monthly-budget"] / mountlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHours
            }

            return res.redirect('/profile')
        },
    }

}

//request, response 
routes.get('/',Job.controlers.index)
routes.get('/job',Job.controlers.create)
routes.post('/job',Job.controlers.save)
routes.get('/job/edit',(req, res) => res.render( views + "job-edit"))
routes.get('/profile',Profile.controlers.index)
routes.post('/profile',Profile.controlers.update)

module.exports = routes;