<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        <?php echo htmlspecialchars($photo['title']); ?> - Alzikrayat
    </title>

    <style>
        .photo-container {
            max-width: 800px;
            margin: 30px auto;
        }

        .photo-container img {
            width: 100%;
            max-height: 600px;
            object-fit: contain;
        }

        .photo-info {
            margin-top: 20px;
        }
    </style>
</head>

<body>

    <div class="photo-container">

        <a href="/alzikrayat/public/photos">
            ← Back to Gallery
        </a>

        <h1>
            <?php echo htmlspecialchars($photo['title']); ?>
        </h1>

       <div class="text-center mb-4">

    <img
        src="/alzikrayat/public/images/uploads/<?php echo htmlspecialchars($photo['file_name']); ?>"
        class="img-fluid"
        style="max-height: 65vh; width: auto; object-fit: contain;"
        alt="<?php echo htmlspecialchars($photo['title']); ?>"
    >

</div>

        <div class="photo-info">

            <p>
                <strong>Author:</strong>
                <?php
                echo htmlspecialchars(
                    $photo['first_name'] . ' ' . $photo['last_name']
                );
                ?>
            </p>

            <p>
                <strong>Date:</strong>
                <?php echo htmlspecialchars($photo['date_time']); ?>
            </p>

            <?php if (!empty($photo['description'])): ?>

                <p>
                    <strong>Description:</strong>
                    <?php echo nl2br(htmlspecialchars($photo['description'])); ?>
                </p>

            <?php endif; ?>

            <?php if ($photo['user_id'] == $_SESSION['user_id']): ?>

    <form
        action="/alzikrayat/public/photo/delete/<?php echo $photo['id']; ?>"
        method="POST"
        onsubmit ="return confirm('Are you sure you want to delete this photo?');" >

        <button type="submit" >
            Delete Photo
        </button>
    </form>

             <?php endif; ?>

        </div>

    </div>
    <h2>Comments</h2>

<form action="/alzikrayat/public/comment/store" method="POST" id ="commentForm">

    <input
        type="hidden"
        name="photo_id"
        value="<?php echo $photo['id']; ?>"
    >

    <textarea
        name="comment"
        placeholder="Write your comment..."
        required
    ></textarea>

    <br><br>

    <button type="submit">Add Comment</button>

</form>

<script>
    
    document.getElementById('commentForm').addEventListener('submit', function(event) {
        const comment = document.querySelector('textarea[name="comment"]').value.trim();

        if (comment === '') {
            event.preventDefault();
            alert('Please enter a comment.');
            return;
        }

        if (comment.length < 3) {
           
            event.preventDefault();
            alert('Comment must be at least 3 characters.');
            return ;
        }

        if (comment.length > 500) {
            event.preventDefault();
            alert('Comment must not exceed 500 characters.');
            return;
        }
    });
</script>

<h2>Comments</h2>

<?php if (!empty($comments)): ?>

    <?php foreach ($comments as $comment): ?>

        <div class="comment">
            <strong>
                <?php echo htmlspecialchars(
                    $comment['first_name'] . ' ' . $comment['last_name']
                ); ?>
            </strong>

            <p>
                <?php echo nl2br(
                    htmlspecialchars($comment['comment'])
                ); ?>
            </p>

            <small>
                <?php echo htmlspecialchars($comment['date_time']); ?>
            </small>
        </div>

        <hr>

    <?php endforeach; ?>

<?php else: ?>

    <p>No comments yet.</p>

<?php endif; ?>
</body>

</html>