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
  try {
    // Get all locations with their attributes
    const places = await prisma.location.findMany({
      orderBy: [{ id: 'desc' }],
      include: {
        locationAttributes: { // This is the relationship table
          include: {
            attribute: { // Include the attribute details (the name)
              select: {
                name: true, // Only fetch the name of the attribute
              },
            },
          },
        },
      },
    });

    console.log(places);

    // Render all locations with attributes
    await res.render('pages/locations', { places: places });
  } catch (error) {
    console.log(error);
    res.render('pages/locations', { places: [] }); // Pass an empty array on error
  }
});



// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// New location page
// app.get('/new', function(req, res) {
//     res.render('pages/new');
// });

app.get('/new', async (req, res) => {
  try {
    // Fetch all attributes from the database
    const attributes = await prisma.attribute.findMany();
    
    // Render the new page with the attributes
    res.render('pages/new', { attributes });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).send('An error occurred');
  }
});


// Create a new location
app.post('/new', async function(req, res) {
  try {
      console.log("Received form data:", req.body);  // Debugging line

      const { name, description, attributes } = req.body;

      // Reload page if empty title or content
      if (!name || !description) {
          console.log("Unable to create new location, no name or description");
          return res.render('pages/new');
      }

      // If no attributes are selected, set an empty array to avoid issues
      const selectedAttributes = Array.isArray(attributes) ? attributes : attributes ? [attributes] : [];

      // Create the new location and associate attributes
      const place = await prisma.location.create({
          data: {
              name,
              description,
              // Relate selected attributes to the new location
              locationAttributes: {
                  create: selectedAttributes.map(attributeId => ({
                      attributeId: parseInt(attributeId) // Make sure it's the correct data type
                  }))
              }
          }
      });

      // Redirect back to the homepage
      res.redirect('/');
  } catch (error) {
      console.log(error);
      res.render('pages/new');
  }
});


// Delete a location by id
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


// Tells the app which port to run on
app.listen(8080);