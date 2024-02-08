$(document).ready(function () {
   console.log('-------------------------------', $);
   let commentId = null;

   // add-comment--------------------
   let blog_id = $('#blogDetailContainer').data('blog-id')
   let username = $('#blogDetailContainer').data('user-name')

   // add and update comment----------------------------------
   $('body').on('click','.btn_comment_submit',function() {
      let comman_field = $(this).closest('.media');
      let updatedComment = comman_field.find('#update_comment_input').val();
      let csrfToken = getCSRFToken();
      // commentId = comman_field.find('.btn_comment_edit').data('comment-id');
      commentText = $('#user_comment').val();
      $.ajax({
         type: "POST",
         url:  commentId ? `/edit-comment/${commentId}` : `/blogdetail/${blog_id}/add-comment`,
         data: commentId ? {
            comment_id: commentId,
            updated_comment: updatedComment,
            csrfmiddlewaretoken: csrfToken
         } : {
            comment_text: commentText,
            csrfmiddlewaretoken: csrfToken
         },
         success: function (response) {
            if (response.success) {
               console.log('-------------response.cId-------------', response.cId);
               console.log('-------------response.commnttext-------------', response.comment_text);
               let new_comment = `
               <div class='d-flex main_comment_div' data-comment-Id='${response.cId}'>
               <div class='rounded-circle  d-flex justify-content-center align-items-center mt-2 mx-2' style='height: 50px; width: 50px; background-color:#D3D3D3'><h4 class='pt-2'>${response.user_name.charAt(0).toUpperCase()}</h4></div>
               <div class="media mb-4 card shadow-sm p-3 col-10">
                 <div class="media-body">
                 <div class='d-flex'>
                     <h5 class="mt-0"><a href="/bloggerdetail/${response.author_id}" class='text-decoration-none text-black'>${response.user_name}</a></h5>
                     <p class='text-muted px-1'>&#183;</p>
                     <p class='text-muted'>${response.customtimesince}</p>
                 </div>
                 <div class='d-flex comment_box'>
                     <p class='comment-content'>${response.comment_text.length > 100 ? response.comment_text.substr(0, 100) + '...' : response.comment_text}</p>
                     <p class="comment-full" style="display: none;">${response.comment_text}</p>
                 </div>  
                 <div class='d-none edit_comment_container'>
                    <div class="mb-3 col-6">
                      <textarea type="text" class="form-control edit_comment_form" id="update_comment_input" rows=4 required></textarea>
                    </div>
                </div>
                 ${response.comment_text.length > 100 ? `<h5 class='show-more-btn text-black btn btn-link mt-0 pt-0 text-decoration-none' style='font-weight: bold;'>...Show more</h5>` : ``}
                   <div class="d-flex justify-content-between align-items-center">
                     <small class="text-muted">Commented on ${response.comment_date}</small>
                      ${username == response.user_name ? `<button class="btn btn-sm btn-outline-primary btn_comment_edit" data-comment-id='${response.cId}'><i class="bi bi-pen"></i></button>` : ``} 
                      <div class='d-none edit_comment_container d-flex'>
                            <button class="btn btn-sm btn-secondary mx-2 btn_cancel">Cancel</button>
                           <button type='submit' class="btn btn-sm btn-primary disabled btn_save btn_comment_submit">Save</button>        
                        </div> 
                   </div>
                 </div>
               </div>
             </div>
               `
               if (commentId) {
                  $(`.main_comment_div[data-comment-Id="${commentId}"]`).replaceWith(new_comment);
                  $('#commentsContainer').prepend($(`.main_comment_div[data-comment-Id="${commentId}"]`));
               } else {
                  if ($('#commentsContainer').is(':empty')) {
                     $('#no_comments').hide();
                  }
                  $('#commentsContainer').prepend(new_comment);
                  $('#user_comment').val('');
               }

                $(this).closest('.media').find('.btn_save').addClass('disabled');
               comman_field.find('.btn_comment_edit').show();
               comman_field.find('.comment_box').toggleClass('d-none');
               comman_field.find('.edit_comment_container').toggleClass('d-none');
               commentId = null;
            }
         },
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
                          <a href="/blog/${response.blog_id}" class='text-decoration-none'> <p class="h5 text-dark text-truncate mx-2" style="max-width: 800px;">${response.blog_title}</p></a>
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
         ShowError('#title_error', 'Please Enter Blog Title***');
         is_valid = false;
      }
      else if ($('#blogDescription').val().trim() == '') {
         ShowError('#desc_error', 'Please Enter Your Blog Description***');
         is_valid = false;
      }

      return is_valid;
   }


   function ShowError(selector, message) {
      $(selector).html(`<h6 class="mt-1 text-danger">${message}</h6>`);
   }

   $(document).on('click', '.show-more-btn', function () {
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

   $(document).on('click', '.btn_comment_edit', function () {
      let comman_field = $(this).closest('.media');

      commentId = comman_field.find('.btn_comment_edit').data('comment-id');

      console.log('-----------------commentId-------------------',commentId);

      comman_field.find('.btn_comment_edit').hide();
      comman_field.find('.comment_box').toggleClass('d-none');
      comman_field.find('.edit_comment_container').toggleClass('d-none');


      user_comment = $(this).closest('.media').find('.comment-full').text().trim();
      comman_field.find('.edit_comment_form').val(user_comment);
   });


   $(document).on('click', '.btn_cancel', function () {
      let comman_field = $(this).closest('.media');

      $(this).closest('.media').find('.btn_save').addClass('disabled');
      comman_field.find('.btn_comment_edit').show();
      comman_field.find('.comment_box').toggleClass('d-none');
      comman_field.find('.edit_comment_container').toggleClass('d-none');
      commentId = null;
   });

   $(document).on('input', '#update_comment_input', function () {
      var inputValue = $(this).val();
      console.log(inputValue);
      let save_button = $(this).closest('.media').find('.btn_save');

      if (inputValue.trim().length > 0) {
         save_button.removeClass('disabled');
      } else {
         save_button.addClass('disabled');
      }
   });



   function getCSRFToken() {
      const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
      if (csrfCookie) {
          return csrfCookie.split('=')[1];
      }
      return null;
  }

});




