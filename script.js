 const API_URL = "https://freemusicarchive.org/featured.json"; // Example endpoint

async function loadFromAPI() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Extract first few tracks
    tracks.length = 0; // clear existing
    data.aTracks.slice(0, 5).forEach(track => {
      tracks.push({
        title: track.track_title,
        artist: track.artist_name,
        src: track.track_file_url,
        cover: track.track_image_file || "default.jpg"
      });
    });

    renderList(tracks);
    load(0); // load first song
  } catch (err) {
    console.error("Error fetching from API", err);
  }
}

// Call this instead of hardcoded tracks init
loadFromAPI();
