// Copyright Project Harbor Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package metadata

import (
	"testing"
	"time"

	"github.com/stretchr/testify/suite"

	event2 "github.com/goharbor/harbor/src/controller/event"
	"github.com/goharbor/harbor/src/pkg/notifier/event"
)

type chartEventTestSuite struct {
	suite.Suite
}

func (r *chartEventTestSuite) TestResolveOfUploadChartEventMetadata() {
	e := &event.Event{}
	metadata := &ChartUploadMetaData{
		ChartMetaData{
			ProjectName: "library",
			ChartName:   "redis-v2.0",
			Versions:    nil,
			OccurAt:     time.Time{},
			Operator:    "admin",
		},
	}
	err := metadata.Resolve(e)
	r.Require().Nil(err)
	r.Equal(event2.TopicUploadChart, e.Topic)
	r.Require().NotNil(e.Data)
	data, ok := e.Data.(*event2.ChartEvent)
	r.Require().True(ok)
	r.Equal("redis-v2.0", data.ChartName)
}

func (r *chartEventTestSuite) TestResolveOfDownloadChartEventMetadata() {
	e := &event.Event{}
	metadata := &ChartDownloadMetaData{
		ChartMetaData{
			ProjectName: "library",
			ChartName:   "redis-v2.0",
			Versions:    nil,
			OccurAt:     time.Time{},
			Operator:    "admin",
		},
	}
	err := metadata.Resolve(e)
	r.Require().Nil(err)
	r.Equal(event2.TopicDownloadChart, e.Topic)
	r.Require().NotNil(e.Data)
	data, ok := e.Data.(*event2.ChartEvent)
	r.Require().True(ok)
	r.Equal("redis-v2.0", data.ChartName)
}

func TestChartEventTestSuite(t *testing.T) {
	suite.Run(t, &chartEventTestSuite{})
}
