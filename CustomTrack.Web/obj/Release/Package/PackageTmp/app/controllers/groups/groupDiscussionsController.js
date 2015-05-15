'use strict';

function GroupDiscussionsController($scope, signalRService, apiServices, $modal, attachmentUpload) {

    $scope.discussion = {};
    $scope.discussion.Url = "#/Group?s=Discussions";
    $scope.discussion.Name = "Privacy Changes 2015";
    $scope.discussion.AuthorName = "Paul Lanzone";
    $scope.discussion.AuthorUrl = "#/Profile/43";
    $scope.discussion.AuthorPicture = "http://az735132.vo.msecnd.net/dev/user-43-1-48CD2D82FB2C5764D63354CAB506F31C-thumb.png";
    $scope.discussion.Content = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
    $scope.discussion.CreatedDate = "24/03/2015";
};