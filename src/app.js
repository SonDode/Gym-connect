import express from 'express'
import ejs from 'ejs'
const app =  express()
const PORT = 3000

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Dashboard',
        user: { firstName: 'Andrei' },
        stats: { volumeChange: 5, workoutsThisMonth: 12 },
        // AICI ADAUGI DATELE NOI:
        latestWorkout: {
            name: 'Push Day',
            day: 'Luni, 2 Martie',
            exercises: [
                { 
                    name: 'Împins la piept cu bara', 
                    sets: [
                        { number: 1, weight: 80, reps: 10 },
                        { number: 2, weight: 85, reps: 8 },
                        { number: 3, weight: 85, reps: 6 }
                    ] 
                },
                { 
                    name: 'Fluturări la cabluri', 
                    sets: [
                        { number: 1, weight: 20, reps: 15 },
                        { number: 2, weight: 20, reps: 12 }
                    ] 
                }
            ]
        },
        // ISTORICUL VECHI:
        history: [
            { date: '28 Feb', type: 'Pull Day', duration: 60 },
            { date: '26 Feb', type: 'Leg Day', duration: 75 }
        ]
    });
});

app.use(express.static('public'));


app.listen(PORT, (err) => {
    if(err) {
        console.log(err)
    }
    console.log("Server running on port:", PORT)
})

