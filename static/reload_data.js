$(document).ready(function () {
   console.log('-------------------------------', $);
   let commentId = null;
   let BlogId;
   let user = $('#getBlogId').data('user-name');
   console.log('user---------------------------', user);

   // add-comment--------------------
   let blog_id = $('#blogDetailContainer').data('blog-id')
   let username = $('#blogDetailContainer').data('user-name')

   // add and update comment----------------------------------
   $('body').on('click', '.btn_comment_submit', function () {
      let comman_field = $(this).closest('.media');
      let updatedComment = comman_field.find('#update_comment_input').val();
      let csrfToken = getCSRFToken();
      commentText = $('#user_comment').val();
      if (Comment_validation()) {
         $.ajax({
            type: "POST",
            url: commentId ? `/edit-comment/${commentId}` : `/blogdetail/${blog_id}/add-comment`,
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
                      <small class="text-muted">Commented on <b>${response.post_date},${response.post_time}</b></small>
                      ${username == response.user_name ? `<div><button class="btn btn-sm btn-outline-primary btn_comment_edit mx-2" data-comment-id='${response.cId}'><i class="bi bi-pen"></i></button><button class="btn btn-sm btn-outline-danger btn_comment_delete" data-comment-delete-id='${response.cId}'><i class="bi bi-archive"></i></button></div>` : ``} 
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
      }
   });


   //  add and update -----blog-post-----------------------
   $('#addBlogForm').submit(function (e) {
      e.preventDefault()
      if (Validation()) {
         $.ajax({
            type: "POST",
            url: BlogId ? `/blog/update-blog-data/${BlogId}` : "/blog/create-blog",
            data: $('#addBlogForm').serialize(),
            success: function (response) {
               console.log('username---------------------', response.user_name);
               if (response.success) {
                  let new_blog_post = `
                  <div class="col-12 mb-5 main_blog_div" data-blog-Id='${response.blog_id}'>
                  <div class="card">
                      <div class="card-body pb-0">
                          <div class='d-flex justify-content-between align-items-center'>
                              <div class='d-flex'>
                                  <a href="/blog/${response.blog_id}" class='text-decoration-none'>
                                  
                                      <p class="h5 text-dark text-truncate mx-2" style="max-width: 800px;">${response.blog_title}</p>
                                  </a>
                                  <p class='text-muted'>&#183;</p>
                                  <p class='text-muted mx-1'>${response.customtimesince}</p>
                                  <p class='text-muted'>(${response.post_time},</p>
                                  <p class='text-muted mx-1'>${response.post_date})</p>
                              </div>
                              ${user.toLowerCase() == response.user_name.toLowerCase() ?
                        `<div class='d-flex mb-3'>
                                      <button class="btn btn-sm btn-outline-primary mx-2" data-bs-toggle='modal' data-bs-target='#addBlogModal' id='btn_edit_blog' data-blog-id='${response.blog_id}'><i class="bi bi-pen"></i></button>
                                      <button class="btn btn-sm btn-outline-danger" id='btn_delete_blog' data-blog-delete-id='${response.blog_id}'><i class="bi bi-archive"></i></button>
                                  </div>`
                        : ``}
                          </div>
                          <div class='d-flex justify-content-end'>
                              <a href="/bloggerdetail/${response.author_id}" class='text-decoration-none'>
                                  <p class='text-black px-3'>- ${response.user_name}</p>
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
               `
                  if (BlogId) {
                     $(`.main_blog_div[data-blog-Id="${BlogId}"]`).replaceWith(new_blog_post);
                     $('#blogPostContainer').prepend($(`.main_blog_div[data-blog-Id="${BlogId}"]`));
                  } else {
                     $('#blogPostContainer').prepend(new_blog_post);
                  }


                  $('#blogTitle').val('');
                  $('#blogDescription').val('');
                  $('#addBlogModal').modal('hide');
                  BlogId = null
               }
            }
         });
      }
   });

   // edit blog button---------------------------------------------
   $('body').on('click', '#btn_edit_blog', function () {
      $('#btn_save_blog').text('Save')
      $('#model_label').text('Update Your Blog...')
      BlogId = $(this).data('blog-id')
      console.log('user--------------', user);
      $.ajax({
         type: "GET",
         url: `/blog/blog-data/${BlogId}`,
         success: function (response) {
            if (response.success) {
               $('#blogTitle').val(response.blog_title);
               $('#blogDescription').val(response.blog_content)
            }
         }
      });
   });

   // delete blog button-----------------------------------------------------------
   $('body').on('click', '#btn_delete_blog', function () {
      Blog_delete_id = $(this).data('blog-delete-id')
      handleDeleteConfirmation(`/blog/delete-blog/${Blog_delete_id}`, function (response) {
         $(`.main_blog_div[data-blog-Id="${Blog_delete_id}"]`).remove();
      })
   });

   // button close-----------------------------------------------------------
   $('body').on('click', '.btn_model_close', function () {
      $('.errorBox').html('');
      $('#blogTitle').val('');
      $('#blogDescription').val('')
      $('#addBlogModal').modal('hide');
      $('#btn_save_blog').text('Add')
      $('#model_label').text('Create Your Blog...')
      BlogId = null;
   })




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



   function Comment_validation() {
      is_valid = true;
      $('.comment_error_box').html('');

      if (!commentId) {
         if ($('#user_comment').val().trim() == '') {
            ShowError('#comment_error', 'Please Enter A Comment***');
            is_valid = false;
         }
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

   // comment edit button------------------------------------
   $(document).on('click', '.btn_comment_edit', function () {
      let comman_field = $(this).closest('.media');

      commentId = comman_field.find('.btn_comment_edit').data('comment-id');

      console.log('-----------------commentId-------------------', commentId);

      comman_field.find('.btn_comment_edit').hide();
      comman_field.find('.btn_comment_delete').hide();
      comman_field.find('.comment_box').toggleClass('d-none');
      comman_field.find('.edit_comment_container').toggleClass('d-none');


      user_comment = $(this).closest('.media').find('.comment-full').text().trim();
      comman_field.find('.edit_comment_form').val(user_comment);
   });


   // comment delete button-----------------------------------------------
   $('body').on('click', '.btn_comment_delete', function () {
      let comman_field = $(this).closest('.media');
      delete_commentId = comman_field.find('.btn_comment_delete').data('comment-delete-id');
      handleDeleteConfirmation(`/delete-comment/${delete_commentId}`, function (response) {
         $(`.main_comment_div[data-comment-Id="${delete_commentId}"]`).remove();
      })
   });


   // comment close button --------------------------------------------------
   $(document).on('click', '.btn_cancel', function () {
      let comman_field = $(this).closest('.media');

      $(this).closest('.media').find('.btn_save').addClass('disabled');
      comman_field.find('.btn_comment_edit').show();
      comman_field.find('.btn_comment_delete').show();
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


   // delete handler------------------------------------
   function handleDeleteConfirmation(url, successCallback) {
      Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
      }).then((result) => {
         if (result.isConfirmed) {
            $.ajax({
               type: "DELETE",
               url: url,
               headers: {
                  'X-CSRFToken': getCSRFToken()
               },
               success: successCallback
            });
         }
      });
   }

   checkcontentHeight();

   function checkcontentHeight() {
      var commentHeight = $('#content').height();
      var lineHeight = parseInt($('#content').css('line-height'));
      var numLines = commentHeight / lineHeight;
      
      if (numLines >= 3) {
          $('#blog_show_more_btn').show();
      } else {
          $('#blog_show_more_btn').hide();
      }
  }


  $('body').on('click','#blog_show_more_btn',function(){
     let  buttonText = $(this).text();

       if(buttonText=='...Show more'){
         $('#content').removeClass('truncate');
         $(this).text('Show less');
       }else{
         $('#content').addClass('truncate');
         $(this).text('...Show more');
       }

  });



});




