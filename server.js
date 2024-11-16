// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

//Google API setup
const axios = require('axios');

const API_KEY = process.env.GOOGLE_API_KEY;

// Route to render the EJS pages with API key
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Views directory setup

app.use((req, res, next) => {
  res.locals.googleApiKey = process.env.GOOGLE_API_KEY;
  next();
});

async function getPlaceDetails(placeName) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;

  try {
    const response = await axios.get(url, {
      params: {
        input: placeName,
        inputtype: 'textquery',
        fields: 'formatted_address,name,geometry',
        key: API_KEY,
      },
    });

    console.log('Place details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling Google Places API:', error.message);
    throw error;
  }
}

getPlaceDetails('Eiffel Tower');



/////////
//PAGES//
/////////
// location page
app.get('/', async function(req, res) {

  // Try-Catch for any errors
  try {
      // Get all locations
      const places = await prisma.location.findMany({
              orderBy: [
                {
                  id: 'desc'
                }
              ]
      });

      // Render all locations
      await res.render('pages/locations', { places: places });
    } catch (error) {
      res.render('pages/locations');
      console.log(error);
    } 
});


// Main landing page
app.get('/home', async function(req, res) {

    // Try-Catch for any errors
    try {
        // Get all blog posts
        const blogs = await prisma.post.findMany({
                orderBy: [
                  {
                    id: 'desc'
                  }
                ]
        });

        // Render the homepage with all the blog posts
        await res.render('pages/home', { blogs: blogs });
      } catch (error) {
        res.render('pages/home');
        console.log(error);
      } 
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// New post page
app.get('/new', function(req, res) {
    res.render('pages/new');
});

// Create a new post
app.post('/new', async function(req, res) {
    
    // Try-Catch for any errors
    try {
        console.log("Received form data:", req.body);  // Add this line for debugging

        // Get the title and content from submitted form
        const { name, description } = req.body;

        // Reload page if empty title or content
        if (!name || !description) {
            console.log("Unable to create new post, no title or content");
            res.render('pages/new');
        } else {
            // Create post and store in database
            const place = await prisma.location.create({
                data: { name, description },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
      } catch (error) {
        console.log(error);
        res.render('pages/new');
      }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.location.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

//demo page
app.get('/demo', function(req, res) {
  res.render('pages/demo');
});

// Tells the app which port to run on
app.listen(8080);