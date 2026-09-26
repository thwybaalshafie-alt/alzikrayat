<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Upload Photo - Alzikrayat</title>
</head>

<body>

    <h1>Upload Photo</h1>

    <form action="/alzikrayat/public/photo/store" method="POST" enctype="multipart/form-data">

        <label>Choose Photo:</label>
        <br>
        <input type="file" name="photos[]" accept="image/*" multiple required>

        <br><br>

        <label>Title:</label>
        <br>
        <input
         type="text"
         name="title" 
         required
         minlength = "3"
         maxlength = "100"
         >

        <br><br>

        <label>Description:</label>
        <br>
        <textarea 
        name="description"
        maxlength ="500"
        ></textarea>

        <br><br>

        <button type="submit">Upload Photo</button>

    </form>

    <br>

    <a href="/alzikrayat/public/photos">
        Back to Gallery
    </a>

    <script>

const form = document.querySelector('form');

form.addEventListener('submit', function(event) {

    const title = document.querySelector('input[name="title"]').value.trim();
    const description = document.querySelector('textarea[name="description"]').value.trim();
    const photos = document.querySelector('input[name="photos[]"]').files;

    if (photos.length === 0) {
        alert('Please select at least one photo.');
        event.preventDefault();
        return;
    }

    if (title.length < 3 || title.length > 100) {
        alert('Title must be between 3 and 100 characters.');
        event.preventDefault();
        return;
    }

    if (description.length > 500) {
        alert('Description must not exceed 500 characters.');
        event.preventDefault();
        return;
    }

});

</script>


</body>

</html>