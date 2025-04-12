<?php
$directory = 'more-game'; // Thay đổi đường dẫn tới thư mục chứa file HTML

// Duyệt qua tất cả các file trong thư mục
$files = glob($directory . '/*.html');

foreach ($files as $file) {
    $html = file_get_contents($file);
    
    // Tìm nội dung trong thẻ <h1 class="sc-1ercfrx-4 kiEtEc">
    if (preg_match('/<h1 class="sc-1ercfrx-4 kiEtEc">(.*?)<\/h1>/', $html, $matches)) {
        $gameTitle = trim($matches[1]);
        $newTitle = "$gameTitle - Play Unblocked & Free On 1v1lol";
        $newMetaDesc = "$gameTitle is one of our best Poki unblocked games that you can play at school. Thousands of the best unblocked games on poki unblocked are waiting for you! Play Now!";
        $newMetaKeywords = "$gameTitle, $gameTitle unblocked";
        $newUrl = "1v1lol.org/" . strtolower(str_replace(' ', '-', $gameTitle));
        
        // Lấy hình ảnh từ thẻ img có class "sc-1ercfrx-1 kVnwop"
        if (preg_match('/<img[^>]+src="([^"]+)"[^>]+class="sc-1ercfrx-1 kVnwop"/', $html, $imgMatch)) {
            $imageUrl = $imgMatch[1];
        } else {
            $imageUrl = "default-image.jpg";
        }
        
        // Sửa thẻ meta robots từ "noindex,nofollow" thành "index,follow"
        $html = preg_replace('/<meta name="robots" content="noindex,nofollow"\s*\/?>/', '<meta name="robots" content="index,follow" />', $html);
        
        // Xóa các thẻ meta cũ (tránh bị trùng lặp)
        $html = preg_replace('/<meta property="og:[^"]+" content="[^"]+" \/>/', '', $html);
        $html = preg_replace('/<meta name="twitter:[^"]+" content="[^"]+" \/>/', '', $html);
        $html = preg_replace('/<meta property="twitter:url" content="[^"]+" \/>/', '', $html);
        
        // Cập nhật thẻ <title>
        if (preg_match('/<title>.*?<\/title>/', $html)) {
            $html = preg_replace('/<title>.*?<\/title>/', "<title>$newTitle</title>", $html);
        } else {
            $html = preg_replace('/<head>/', "<head>\n<title>$newTitle</title>", $html, 1);
        }
        
        // Thêm hoặc cập nhật thẻ meta description
        if (preg_match('/<meta name="description" content=".*?"\s*\/?>/', $html)) {
            $html = preg_replace('/<meta name="description" content=".*?"\s*\/?>/', "<meta name=\"description\" content=\"$newMetaDesc\" />", $html);
        } else {
            $html = preg_replace('/(<title>.*?<\/title>)/', "$1\n<meta name=\"description\" content=\"$newMetaDesc\" />", $html, 1);
        }
        
        // Chèn lại các thẻ meta sau thẻ <meta name="description" />
        $metaTags = "<meta property=\"og:title\" content=\"$newTitle\" />\n"
                  . "<meta property=\"og:type\" content=\"website\" />\n"
                  . "<meta property=\"og:image\" content=\"$imageUrl\" />\n"
                  . "<meta property=\"og:url\" content=\"$newUrl\" />\n"
                  . "<meta property=\"og:description\" content=\"$newMetaDesc\" />\n"
                  . "<meta property=\"og:site_name\" content=\"$newTitle\" />\n"
                  . "<meta property=\"og:image:width\" content=\"630\" />\n"
                  . "<meta property=\"og:image:height\" content=\"630\" />\n"
                  . "<meta name=\"twitter:card\" content=\"summary\" />\n"
                  . "<meta name=\"twitter:title\" content=\"$newTitle\" />\n"
                  . "<meta name=\"twitter:description\" content=\"$newMetaDesc\" />\n"
                  . "<meta name=\"twitter:image\" content=\"$imageUrl\" />\n"
                  . "<meta property=\"twitter:url\" content=\"$newUrl\" />\n";
        
        $html = preg_replace('/(<meta name="description" content=".*?"\s*\/?>)/', "$1\n$metaTags", $html, 1);
        
        // Ghi lại file
        file_put_contents($file, $html);
        echo "Updated: $file\n";
    } else {
        echo "No matching <h1> found in: $file\n";
    }
}

echo "Done!";
