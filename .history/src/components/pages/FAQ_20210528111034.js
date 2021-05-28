import React from "react"
import NavBar from '../layout/NavBar.js'

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
        
<div class="row accordion-gradient-bcg d-flex justify-content-center">


  <div class="col-md-10 col-xl-6 py-5">


    <div class="accordion md-accordion accordion-2" id="accordionEx7" role="tablist"
      aria-multiselectable="true">

  
      <div class="card">

   
        <div class="card-header rgba-stylish-strong z-depth-1 mb-1" role="tab" id="heading1">
          <a data-toggle="collapse" data-parent="#accordionEx7" href="#collapse1" aria-expanded="true"
            aria-controls="collapse1">
            <h5 class="mb-0 white-text text-uppercase font-thin">
              #1 <i class="fas fa-angle-down rotate-icon"></i>
            </h5>
          </a>
        </div>

       
        <div id="collapse1" class="collapse show" role="tabpanel" aria-labelledby="heading1"
          data-parent="#accordionEx7">
          <div class="card-body mb-1 rgba-grey-light white-text">
            <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
              3 wolf moon officia aute,
              non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch
              3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
              shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
              sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer
              farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them
              accusamus labore sustainable.</p>
          </div>
        </div>
      </div>
  


      <div class="card">

     
        <div class="card-header rgba-stylish-strong z-depth-1 mb-1" role="tab" id="heading2">
          <a class="collapsed" data-toggle="collapse" data-parent="#accordionEx7" href="#collapse2"
            aria-expanded="false" aria-controls="collapse2">
            <h5 class="mb-0 white-text text-uppercase font-thin">
              #2 <i class="fas fa-angle-down rotate-icon"></i>
            </h5>
          </a>
        </div>

      
        <div id="collapse2" class="collapse" role="tabpanel" aria-labelledby="heading2"
          data-parent="#accordionEx7">
          <div class="card-body mb-1 rgba-grey-light white-text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>
      

  
      <div class="card">

        <div class="card-header rgba-stylish-strong z-depth-1 mb-1" role="tab" id="heading3">
          <a class="collapsed" data-toggle="collapse" data-parent="#accordionEx7" href="#collapse3"
            aria-expanded="false" aria-controls="collapse3">
            <h5 class="mb-0 white-text text-uppercase font-thin">
              #3 <i class="fas fa-angle-down rotate-icon"></i>
            </h5>
          </a>
        </div>

   
        <div id="collapse3" class="collapse" role="tabpanel" aria-labelledby="heading3"
          data-parent="#accordionEx7">
          <div class="card-body mb-1 rgba-grey-light white-text">
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
              beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
              odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
              quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem.</p>
          </div>
        </div>
      </div>
     
    </div>


  </div>
  

</div>


        </div>
    );
}