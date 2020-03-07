<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>UI Dashboard Website</title>
  <!-- Font Awesome -->
  
  <link rel="stylesheet" type="text/css" href="fontawesome-free-5.8.1-web/css/all.css">
  <!-- Bootstrap core CSS -->
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <!-- Material Design Bootstrap -->
  <link href="css/mdb.min.css" rel="stylesheet">
  <!-- Your custom styles (optional) -->
  <link href="css/style.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

</head>

<body>

  
  <!-- navigation menu -->
<div class="wrapper" >
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <a href="#" class="navbar-brand text-warning">&nbsp;&nbsp;Bill&Cert</a>
        <button class="navbar-toggler " data-toggle="collapse" data-target="#menu"> 
          <span class="navbar-toggler-icon"></span>
        </button>
      <div class="collapse navbar-collapse" id="menu">
        <ul class="navbar-nav ml-auto">
           <li class="nav-item">
          </li>
          <li class="nav-item">
            <a href="" class="nav-link">
              <i class="fas fa-sign-out-alt"></i> Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  <!-- navigation menu ends here -->
  <!-- creating headin of dashboard -->
    <div class=" py-3 text-white" style="background-color: teal">
      <h1>&nbsp;&nbsp;<i class="fas fa-chart-bar"></i> Dashboard</h1>
    </div>
    <div class="bg-light p-3">
     
    <div class="row">
       <div class="col-md-4">
         <a class="btn btn-primary d-block font-weight-bold" onclick="myFunction()">
          <i class="fas fa-plus"></i> &nbsp;STAFF</a>
       </div>
       <div class="col-md-4">
         <a href="" class="btn btn-success d-block font-weight-bold" data-toggle="modal" data-target="#modalstaff">
          <i class="fas fa-plus"></i> &nbsp; STUDENT</a>
       </div>
       <div class="col-md-4">
         <a href="" class="btn btn-warning d-block font-weight-bold" data-toggle="modal" data-target="#modalcourse">
          <i class="fas fa-plus"></i> &nbsp;COURSE</a>
       </div>
    </div>
  </div>
</div>

 <!-- creating dashboard of report-->

    <div class="bg-light p-3">
     
    <div class="row">
       <div class="col-md-4">
         <a class="btn btn-primary d-block font-weight-bold" onclick="myFunction()">
          <i class="fal fa-file"></i> &nbsp;STAFF report</a>
       </div>
       <div class="col-md-4">
         <a href="" class="btn btn-success d-block font-weight-bold" data-toggle="modal" data-target="#modalstaff">
          <i class="fal fa-file"></i> &nbsp; STUDENT report</a>
       </div>
       <div class="col-md-4">
         <a href="" class="btn btn-warning d-block font-weight-bold" data-toggle="modal" data-target="#modalcourse">
          <i class="fal fa-file"></i> &nbsp;COURSE report</a>
       </div>
    </div>
  </div>
</div>


<!-- Modal for course  -->
<div class="modal fade" id="modalcourse" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Enter Course</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <form>
  <div class="form-group">
    <label for="coursename">Course name</label>
    <input type="text" class="form-control" id="coursename" aria-describedby="emailHelp">
  </div>
  <div class="form-group">
    <label for="coursedur">Course duration</label>
    <input type="text" class="form-control" id="coursedur">
  </div>
  <div class="form-group">
    <label for="coursefees">Course Fees</label>
    <input type="number" class="form-control" id="coursefees">
  </div>
  

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </div>
</form>
  </div>
</div>


<!-- Modal for Staff  -->
<div class="modal fade" id="modalstaff" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">New Staff</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <form>
<div class="row"> 
  <div class="form-group col-md-5">
    <label for="user_id" >USER ID</label>
    <input type="text" class="form-control" id="userid" aria-describedby="">
  </div>
<div class="form-group col-md-5">
    <label for="Employeeid">Employee id</label>
    <input type="text" class="form-control" id="empid" aria-describedby="">
  </div>
</div>
<div class="form-group">
    <label for="username">User name</label>
    <input type="text" class="form-control" id="user name" aria-describedby="">
  </div>

<div class="row"> 
  <div class="form-group col-md-5">
    <label for="fname" >First Name</label>
    <input type="text" class="form-control" id="fname" aria-describedby="">
  </div>
<div class="form-group col-md-5">
    <label for="lname">Last Name</label>
    <input type="text" class="form-control" id="lname" aria-describedby="">
  </div>
</div>

<div class="form-group">
    <label for="Emailid">Email id</label>
    <input type="text" class="form-control" id="Emailid" aria-describedby="email">
  </div>

<div class=row>
<div class="form-group col-md-5">
    <label for="contact">Contact</label>
    <input type="number" class="form-control" id="contact" aria-describedby="">
  </div>
<div class="form-group col-md-5">
    <label for="Dob">Date of Birth</label>
    <input type="text" class="form-control" id="dob" aria-describedby="dob">
  </div>  
</div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </div>
</form>
  </div>
</div>



</body>
</html>









  <!-- dashboard heading ends -->
  <!-- JQuery -->
  <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
  <!-- Bootstrap tooltips -->
  <script type="text/javascript" src="js/popper.min.js"></script>
  <!-- Bootstrap core JavaScript -->
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <!-- MDB core JavaScript -->
  <script type="text/javascript" src="js/mdb.min.js"></script>
</body>

</html>
