from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User as BaseUser

from app.services.utils import user_upload_dir

"""
Abstract representation of a site user

Extends:
	models.User
"""
class User(BaseUser):
	class Meta:
		# map all available function calls 
		# to the super base user class
		proxy = True

	def datasets(self):
		"""
		Helper method to get user's datasets
		
		Returns:
			QuerySet -- datasets
		"""
		return self.dataset_set

	def bookmarks(self):
		"""
		Helper method to get user's bookmarks
		
		Returns:
			QuerySet -- bookmarks
		"""
		return self.bookmark_set

"""
Abstract representation of a dataset 
that will be processed by Spark

Extends:
	models.Model
"""
class Dataset(models.Model):
	# whether this dataset should be publicize
	publicized = models.BooleanField(default = False)
	# whether this dataset has finished processing
	processed = models.BooleanField(default = False)
	# title for this dataset
	title = models.CharField(max_length = 256, default = "")
	# dataset's raw file field
	raw_data_file = models.FileField(upload_to=user_upload_dir, default = "")
	# dataset's analyzed json file name
	analyzed_json_filename = models.CharField(max_length = 256, default = "")
	# dataset's anomaly data json file name
	anomaly_json_filename = models.CharField(max_length = 256, default = "")
	# the user who uploads this dataset
	uploader = models.ForeignKey(User, on_delete = models.CASCADE)
	# timestamps
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)

"""
Bookmark user can make on a specific node of a dataset

Extends:
	models.Model
"""
class Bookmark(models.Model):
	# bookmark's creator (User)
	creator = models.ForeignKey(User, on_delete = models.CASCADE)
	# a numerical representation of this bookmark's color, assigned by user
	priority = models.IntegerField()
	# x coordinate the bookmark refers to
	x_coord = models.CharField(max_length = 256, default = "")
	# y coordinate the bookmrk refers to
	y_coord = models.CharField(max_length = 256, default = "")
	# index of the properties that this bookmark refers to
	property_index = models.IntegerField(default = 0)
	# dataset that this bookmark resides on
	dataset = models.ForeignKey(Dataset, on_delete = models.CASCADE)
	# whether this bookmark should be publicize
	publicized = models.BooleanField(default = False)
	# timestamps
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
