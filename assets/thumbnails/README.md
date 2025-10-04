# Video Thumbnails

This directory contains thumbnail images for the course videos displayed in the app.

## Directory Structure

- `/thumbnails/genai/` - Thumbnails for Generative AI courses
- `/thumbnails/python/` - Thumbnails for Python programming courses  
- `/thumbnails/business/` - Thumbnails for Business & Finance courses

## Adding New Thumbnails

To add a new thumbnail:

1. Create your image file (recommended size: 320x180px, format: PNG)
2. Place it in the appropriate category folder
3. Update the THUMBNAIL_IMAGES object in FreeCoursesRow.js to reference your new image
4. Add the thumbnailKey property to the corresponding video object in COURSE_DATA

## Example

```javascript
// In FreeCoursesRow.js

// 1. Add the image to THUMBNAIL_IMAGES
const THUMBNAIL_IMAGES = {
  genai: {
    // ... existing thumbnails
    myNewThumbnail: require('../../assets/thumbnails/genai/my-new-thumbnail.png'),
  },
  // ... other categories
};

// 2. Reference it in your video data
const COURSE_DATA = [
  {
    id: 'genai',
    title: 'Generative AI Tools & Applications',
    videos: [
      {
        title: 'My New Course',
        url: 'https://www.youtube.com/watch?v=abcdefg',
        thumbnailKey: 'myNewThumbnail' // Reference the key in THUMBNAIL_IMAGES
      },
      // ... other videos
    ]
  },
  // ... other categories
];
```