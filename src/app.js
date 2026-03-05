import express from 'express';
import ejs from 'ejs';
import session from 'express-session'; // <-- 1. Am importat modulul de sesiuni

const app = express();
const PORT = 3000;

// ==========================================
// 1. CONFIGURĂRI ȘI MIDDLEWARE
// ==========================================

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Configurăm Sesiunile (brățara de acces)
app.use(session({
    secret: 'cheia_mea_super_secreta_gym_connect', // Folosită pentru criptarea sesiunii
    resave: false,
    saveUninitialized: false
}));

// 3. Creăm "Paznicul" (Middleware de autentificare)
const requireAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        // Dacă utilizatorul are sesiunea activă, îl lăsăm să treacă mai departe
        next(); 
    } else {
        // Dacă nu, îl redirecționăm forțat către pagina de login
        res.redirect('/login');
    }
};

// ==========================================
// 2. RUTELE PENTRU AUTENTIFICARE
// ==========================================

// Dacă cineva intră pe /login, îi arătăm pagina
app.get('/login', (req, res) => {
    // Dacă e deja logat, nu are sens să mai vadă login-ul, îl trimitem pe dashboard
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'andrei@gmail.com' && password === 'admin123') {
        // SUCCES: Setăm sesiunea ca fiind activă (îi dăm brățara)
        req.session.isLoggedIn = true;
        res.redirect('/'); 
    } else {
        // EȘEC: Reîncărcăm pagina de login
        res.render('login', { error: 'Email sau parolă incorecte. Te rugăm să încerci din nou.' });
    }
});

// Opțional: Rută pentru Delogare (să poți ieși din cont)
app.get('/logout', (req, res) => {
    req.session.destroy(); // Distrugem brățara
    res.redirect('/login');
});

// ==========================================
// 3. RUTA PRINCIPALĂ (DASHBOARD) - ACUM ESTE PROTEJATĂ!
// ==========================================

// Observă că am adăugat `requireAuth` între '/ ' și `(req, res)`
app.get('/', requireAuth, (req, res) => {
    res.render('index', {
        pageTitle: 'Dashboard',
        user: { firstName: 'Andrei' },
        stats: { volumeChange: 5, workoutsThisMonth: 12 },
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
        history: [
            { date: '28 Feb', type: 'Pull Day', duration: 60 },
            { date: '26 Feb', type: 'Leg Day', duration: 75 }
        ]
    });
});

// ==========================================
// 4. PORNIREA SERVERULUI
// ==========================================

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    }
    console.log("🚀 Server running on port:", PORT);
});