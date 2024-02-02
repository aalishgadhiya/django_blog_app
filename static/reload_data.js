$(document).ready(function () {
   console.log('-------------------------------',$);
   let blog_id = $('#blogDetailContainer').data('blog-id')
   $('#comment_form').submit(function(e){
      e.preventDefault()
         $.ajax({
            type: "POST",
            url: `/blogdetail/${blog_id}`,
            data: $('#comment_form').serialize(),
            success: function (response) {
               console.log(response.comment_text);
               if(response.success){
                  let new_comment  = `<hr><p>${response.comment_text}- ${response.user_name} - ${response.comment_date}</p>`
                  $('#commentsContainer').prepend(new_comment);

                  $('#user_comment').val('');
               }
            }
         });
     });
});