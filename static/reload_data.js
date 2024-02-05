$(document).ready(function () {
   console.log('-------------------------------', $);
   // add-comment--------------------
   let blog_id = $('#blogDetailContainer').data('blog-id')
   $('#comment_form').submit(function (e) {
      e.preventDefault()
      $.ajax({
         type: "POST",
         url: `/blogdetail/${blog_id}`,
         data: $('#comment_form').serialize(),
         success: function (response) {
            console.log(response.comment_text);
            if (response.success) {
               let new_comment = `<hr><p>${response.comment_text}- ${response.user_name} - ${response.comment_date}</p>`
               $('#commentsContainer').prepend(new_comment);

               $('#user_comment').val('');
            }
         }
      });
   });


   //  add blog-post-----------------------
   $('#addBlogForm').submit(function (e) {
      e.preventDefault()
      if (Validation()) {
         $.ajax({
            type: "POST",
            url: "/blog/all",
            data: $('#addBlogForm').serialize(),
            success: function (response) {
               if (response.success) {
                  let new_blog_post = `
               <div class="col-12 mb-5">
                   <div class="card">
                       <div class="card-body">
                        <a href="/blogdetail/${response.blog_id}" class='text-decoration-none'> <p class="h5 text-dark">${response.blog_title}</p></a>
                        <div class='d-flex'>
                            <p class='text-muted'>${response.post_date}</p>
                            <p class='text-muted px-3'>${response.post_time}</p>
                            <a href="/bloggerdetail/${response.author_id}" class='text-decoration-none'> <p class='text-muted px-3'>- ${response.user_name}</p> </a>
                        </div> 
                       </div>
                   </div>  
               </div>
               `
                  $('#blogPostContainer').prepend(new_blog_post);

                  $('#blogTitle').val('');
                  $('#blogDescription').val('');
                  $('#addBlogModal').modal('hide');
               }
            }
         });
      }
   });




   function Validation() {
      is_valid = true;
      $('.errorBox').html('');

      if ($('#blogTitle').val().trim() == '') {
         ShowError('#title_error','Please Enter Blog Title***');
         is_valid = false;
      }
      else if ($('#blogDescription').val().trim() == '') {
         ShowError('#desc_error','Please Enter Your Blog Description***');
         is_valid = false;
      }

      return is_valid;
   }


   function ShowError(selector, message) {
      $(selector).html(`<h6 class="mt-1 text-danger">${message}</h6>`);
   }
});


