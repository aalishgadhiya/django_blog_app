$(document).ready(function () {
   console.log('-------------------------------', $);
   // add-comment--------------------
   let blog_id = $('#blogDetailContainer').data('blog-id')
   let username = $('#blogDetailContainer').data('user-name')
   $('#comment_form').submit(function (e) {
      e.preventDefault()
      $.ajax({
         type: "POST",
         url: `/blogdetail/${blog_id}/add-comment`,
         data: $('#comment_form').serialize(),
         success: function (response) {
            if (response.success) {
               console.log('-------------comment-------------',response.comment_text);
               let new_comment = `
               <div class='d-flex'>
               <div class='rounded-circle  d-flex justify-content-center align-items-center mt-2 mx-2' style='height: 50px; width: 50px; background-color:#D3D3D3'><h4 class='pt-2'>${response.user_name.charAt(0).toUpperCase()}</h4></div>
               <div class="media mb-4 card shadow-sm p-3 col-10">
                 <div class="media-body">
                 <div class='d-flex'>
                     <h5 class="mt-0">${response.user_name}</h5>
                     <p class='text-muted px-1'>&#183;</p>
                     <p class='text-muted'>${response.customtimesince}</p>
                 </div>
                 <div class='d-flex'>
                     <p class='comment-content'>${response.comment_text.length > 100 ? response.comment_text.slice(0.100):response.comment_text}</p>
                     <p class="comment-full" style="display: none;">{{comment.description}}</p>
                 </div>  
                 ${response.comment_text.length > 100?`<h5 class='show-more-btn text-black btn btn-link mt-0 pt-0 text-decoration-none' style='font-weight: bold;'>...Show more</h5>`:``}
                   <div class="d-flex justify-content-between align-items-center">
                     <small class="text-muted">Commented on ${response.comment_date}</small>
                      ${username == response.user_name ? `<button type="button" class="btn btn-sm btn-outline-primary">Edit</button>` : ``} 
                   </div>
                 </div>
               </div>
             </div>
               `
               if ($('#commentsContainer').is(':empty')) {
                  $('#no_comments').hide();
              }              
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
            url: "/blog/create-blog",
            data: $('#addBlogForm').serialize(),
            success: function (response) {
               if (response.success) {
                  let new_blog_post = `
               <div class="col-12 mb-5">
                   <div class="card">
                       <div class="card-body pb-0">
                       <div class='d-flex'>
                          <a href="/blogdetail/${response.blog_id}" class='text-decoration-none'> <p class="h5 text-dark text-truncate mx-2" style="max-width: 800px;">${response.blog_title}</p></a>
                          <p class='text-muted'>&#183;</p>
                          <p class='text-muted mx-1'>${response.customtimesince}</p>
                          <p class='text-muted'>(${response.post_time},</p>
                          <p class='text-muted mx-1'>${response.post_date})</p>
                        </div>
                        <div class='d-flex justify-content-end'>
                            <a href="/bloggerdetail/${response.author_id}" class='text-decoration-none'> <p class='text-black px-3'>- ${response.user_name}</p> </a>
                        </div> 
                       </div>
                   </div>  
               </div>
               `;

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

   $('.show-more-btn').on('click', function() {
      var commentContent = $(this).parent().find('.comment-content');
      var commentFull = $(this).parent().find('.comment-full');
      if (commentContent.is(':visible')) {
          commentContent.hide();
          commentFull.show();
          $(this).text('Show less');
      } else {
          commentContent.show();
          commentFull.hide();
          $(this).text('...Show more');
      }
  });
});


