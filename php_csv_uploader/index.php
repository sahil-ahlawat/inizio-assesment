<?php
// Database connection parameters - adjust if necessary based on your Docker setup
$dbHost = 'mysql'; // Service name from docker-compose.yml
$dbName = 'php_app'; // Database name as per mysql-init/php_app.sql
$dbUser = 'root';    // Default MySQL user in many Docker setups
$dbPass = 'root';    // Default MySQL password in many Docker setups

$message = ''; // Variable to store status messages

// Check if a file has been uploaded
if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] === UPLOAD_ERR_OK) {
    $csvFile = $_FILES['csv_file']['tmp_name']; // Temporary path of the uploaded file
    $fileExtension = pathinfo($_FILES['csv_file']['name'], PATHINFO_EXTENSION);

    // Validate file extension
    if (strtolower($fileExtension) !== 'csv') {
        $message = '<p style="color: red;">Error: Only CSV files are allowed.</p>';
    } else {
        try {
            // Establish database connection using PDO
            $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Set error mode to exceptions

            $message .= '<p style="color: blue;">Uploading CSV file...</p>';

            // Open the uploaded CSV file for reading
            if (($handle = fopen($csvFile, "r")) !== FALSE) {
                $rowNum = 0; // Initialize row counter

                // Prepare SQL statements outside the loop for efficiency
                $stmtPost = $pdo->prepare("INSERT INTO posts (title) VALUES (:title)");
                $stmtMeta = $pdo->prepare("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES (:post_id, :meta_key, :meta_value)");

                // Start a transaction for atomicity
                $pdo->beginTransaction();

                while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                    $rowNum++;
                    // Skip empty rows
                    if (empty(array_filter($data))) {
                        continue;
                    }

                    // The first column is the title for the 'posts' table
                    $title = $data[0] ?? 'Untitled Post';

                    // Insert into 'posts' table
                    $stmtPost->bindParam(':title', $title);
                    $stmtPost->execute();
                    $postId = $pdo->lastInsertId(); // Get the ID of the newly inserted post

                    // Insert remaining columns into 'post_meta' table
                    // Assuming columns are 0-indexed, so meta_key will be 'column_1', 'column_2', etc.
                    for ($col = 1; $col < count($data); $col++) {
                        $metaKey = 'column_' . $col; // Use column number as meta_key
                        $metaValue = $data[$col];

                        $stmtMeta->bindParam(':post_id', $postId);
                        $stmtMeta->bindParam(':meta_key', $metaKey);
                        $stmtMeta->bindParam(':meta_value', $metaValue);
                        $stmtMeta->execute();
                    }
                }

                // Commit the transaction if all operations were successful
                $pdo->commit();
                fclose($handle); // Close the CSV file handle
                $message .= '<p style="color: green;">Upload complete! ' . $rowNum . ' rows processed.</p>';

            } else {
                $message = '<p style="color: red;">Error: Could not open the uploaded CSV file.</p>';
            }
        } catch (PDOException $e) {
            // Rollback transaction on error
            if ($pdo && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $message = '<p style="color: red;">Database Error: ' . $e->getMessage() . '</p>';
        } catch (Exception $e) {
            $message = '<p style="color: red;">General Error: ' . $e->getMessage() . '</p>';
        }
    }
} else if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] !== UPLOAD_ERR_NO_FILE) {
    // Handle other file upload errors
    $message = '<p style="color: red;">File Upload Error: ' . $_FILES['csv_file']['error'] . '</p>';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSV Uploader</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
        .container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
        h1 { text-align: center; color: #333; }
        form { display: flex; flex-direction: column; gap: 15px; }
        input[type="file"] { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        input[type="submit"] { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        input[type="submit"]:hover { background-color: #0056b3; }
        .message { margin-top: 20px; padding: 10px; border-radius: 4px; }
        .message p { margin: 0; }
        .message p.green { color: green; }
        .message p.red { color: red; }
        .message p.blue { color: blue; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Upload CSV File</h1>

        <?php if (!empty($message)): ?>
            <div class="message">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form action="" method="post" enctype="multipart/form-data">
            <label for="csv_file">Select CSV to upload:</label>
            <input type="file" name="csv_file" id="csv_file" accept=".csv" required>
            <input type="submit" value="Upload CSV">
        </form>
    </div>
</body>
</html>
