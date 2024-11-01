<script lang="ts">
    import { Label } from "$lib/components/ui/label";
      import { Input } from "$lib/components/ui/input";
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Find Business Leads</h1>
	<p>Search for businesses in your area.</p>
</div>

<div>
	<form>
			

				<Label>City</Label>
					<Input type="text" placeholder="Enter city" />

		
				<Label>State</Label>
					<Input type="text" placeholder="Enter state" maxlength="2" />

				<Label>Zip Code</Label>
					<Input type="text" placeholder="Enter zip code" maxlength="5" />

				<Label>Business Type</Label>
				<select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6">
					<option value="" disabled selected>Select business type</option>
					<option value="accountant">Accountant</option>
					<option value="advertising_agency">Advertising Agency</option>
					<option value="airline">Airline</option>
					<option value="airport">Airport</option>
					<option value="amusement_park">Amusement Park</option>
					<option value="aquarium">Aquarium</option>
					<option value="art_gallery">Art Gallery</option>
					<option value="attorney">Attorney</option>
					<option value="bakery">Bakery</option>
					<option value="bank">Bank</option>
					<option value="bar">Bar</option>
					<option value="beauty_salon">Beauty Salon</option>
					<option value="bicycle_store">Bicycle Store</option>
					<option value="book_store">Book Store</option>
					<option value="bowling_alley">Bowling Alley</option>
					<option value="bus_station">Bus Station</option>
					<option value="cafe">Cafe</option>
					<option value="campground">Campground</option>
					<option value="car_dealer">Car Dealer</option>
					<option value="car_rental">Car Rental</option>
					<option value="car_repair">Car Repair</option>
					<option value="car_wash">Car Wash</option>
					<option value="casino">Casino</option>
					<option value="cemetery">Cemetery</option>
					<option value="church">Church</option>
					<option value="city_hall">City Hall</option>
					<option value="clothing_store">Clothing Store</option>
					<option value="convenience_store">Convenience Store</option>
					<option value="courthouse">Courthouse</option>
					<option value="dentist">Dentist</option>
					<option value="department_store">Department Store</option>
					<option value="doctor">Doctor</option>
					<option value="electrician">Electrician</option>
					<option value="electronics_store">Electronics Store</option>
					<option value="embassy">Embassy</option>
					<option value="fire_station">Fire Station</option>
					<option value="florist">Florist</option>
					<option value="funeral_home">Funeral Home</option>
					<option value="furniture_store">Furniture Store</option>
					<option value="gas_station">Gas Station</option>
					<option value="gym">Gym</option>
					<option value="hair_care">Hair Care</option>
					<option value="hardware_store">Hardware Store</option>
					<option value="hindu_temple">Hindu Temple</option>
					<option value="home_goods_store">Home Goods Store</option>
					<option value="hospital">Hospital</option>
					<option value="insurance_agency">Insurance Agency</option>
					<option value="jewelry_store">Jewelry Store</option>
					<option value="laundry">Laundry</option>
					<option value="lawyer">Lawyer</option>
					<option value="library">Library</option>
					<option value="liquor_store">Liquor Store</option>
					<option value="local_government_office">Local Government Office</option>
					<option value="locksmith">Locksmith</option>
					<option value="lodging">Lodging</option>
					<option value="meal_delivery">Meal Delivery</option>
					<option value="meal_takeaway">Meal Takeaway</option>
					<option value="mosque">Mosque</option>
					<option value="movie_rental">Movie Rental</option>
					<option value="movie_theater">Movie Theater</option>
					<option value="moving_company">Moving Company</option>
					<option value="museum">Museum</option>
					<option value="night_club">Night Club</option>
					<option value="painter">Painter</option>
					<option value="park">Park</option>
					<option value="parking">Parking</option>
					<option value="pet_store">Pet Store</option>
					<option value="pharmacy">Pharmacy</option>
					<option value="physiotherapist">Physiotherapist</option>
					<option value="plumber">Plumber</option>
					<option value="police">Police</option>
					<option value="post_office">Post Office</option>
					<option value="real_estate_agency">Real Estate Agency</option>
					<option value="restaurant">Restaurant</option>
					<option value="roofing_contractor">Roofing Contractor</option>
					<option value="rv_park">RV Park</option>
					<option value="school">School</option>
					<option value="shoe_store">Shoe Store</option>
					<option value="shopping_mall">Shopping Mall</option>
					<option value="spa">Spa</option>
					<option value="stadium">Stadium</option>
					<option value="storage">Storage</option>
					<option value="store">Store</option>
					<option value="subway_station">Subway Station</option>
					<option value="supermarket">Supermarket</option>
					<option value="synagogue">Synagogue</option>
					<option value="taxi_stand">Taxi Stand</option>
					<option value="train_station">Train Station</option>
					<option value="travel_agency">Travel Agency</option>
					<option value="university">University</option>
					<option value="veterinary_care">Veterinary Care</option>
					<option value="zoo">Zoo</option>
				</select>
	</form>

	<Button>Start Searching</Button>
</div>